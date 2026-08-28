export const requireOwnership = ({
  getOwnerId,
  getCurrentUserId = (req) => req.user._id,
}) => {
  return async (req, res, next) => {
    try {
      const ownerId = await getOwnerId(req);
      const currentUserId = getCurrentUserId(req);

      if (!ownerId) {
        return res.status(404).json({
          message: "Resource not found",
        });
      }

      if (ownerId.toString() !== currentUserId.toString()) {
        return res.status(403).json({
          message: "You do not own this resource",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};