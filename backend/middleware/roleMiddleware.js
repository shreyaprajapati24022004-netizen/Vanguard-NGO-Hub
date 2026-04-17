const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Role '${req.user.role}' ko ye karne ki permission nahi hai`,
      });
    }
    next();
  };
};

module.exports = { authorizeRoles };