export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    // Convert all roles to uppercase for safe comparison
    const normalizedAllowedRoles = allowedRoles.map((role) => role.toUpperCase());
    const userRole = req.user.role ? req.user.role.toUpperCase() : "";

    if (
      normalizedAllowedRoles.length > 0 &&
      !normalizedAllowedRoles.includes(userRole)
    ) {
      return res.status(403).json({
        message: "You do not have permission to access this resource",
      });
    }

    next();
  };
};