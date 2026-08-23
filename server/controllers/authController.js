import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { verifyGoogleToken } from '../utils/google.js';

// Helper to generate the JWT Session Token
const createSessionToken = (user) => {
  return jwt.sign(
    { userId: user._id.toString() },
    process.env.SESSION_SECRET,
    { expiresIn: '7d' } // Fixed: Wrapped 7d in quotes
  );
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    const payload = await verifyGoogleToken(credential);
    const { 
      sub: googleId, 
      email, 
      name, 
      picture, 
      email_verified: emailVerified 
    } = payload;

    if (!googleId || !email || !name) {
      return res.status(400).json({ message: 'Required Google profile information is missing' });
    }

    if (!emailVerified) {
      return res.status(401).json({ message: 'Google email is not verified' });
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.create({
        googleId,
        email,
        name,
        avatar: picture || '',
        role: 'buyer', // Secure default role fallback
      });
    } else {
      // Keep user profile up-to-date with Google adjustments while preserving roles
      user.name = name;
      user.avatar = picture || user.avatar;
      user.email = email; 
      await user.save();
    }

    const sessionToken = createSessionToken(user);
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: isProduction, // Must be true if sameSite is 'none'
      sameSite: isProduction ? 'none' : 'lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    return res.status(200).json({
      message: 'Google authentication successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({ message: 'Google authentication failed' });
  }
};

export const getCurrentUser = async (req, res) => {
  return res.status(200).json({
    user: req.user,
  });
};

export const logout = async (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.clearCookie('session', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });
  
  return res.status(200).json({ message: 'Logged out successfully' });
};
