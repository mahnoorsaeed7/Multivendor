import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();

export const verifyGoogleToken = async (idToken) => {
  if (!idToken) {
    throw new Error("Google ID token is required");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throw new Error("Google token payload is missing");
  }

  return payload;
};