const User = require("../models/User");
const restrict = (role) => {
  return async(req, res, next) => {
    const user = await User.findById(req.userId)
    if (user.role !== role) {
      const error = new Error("You do not have permission for this action");
      error.status = 401; 
      return next(error);
    }
    next();
  };
};

module.exports = restrict;
