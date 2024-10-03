const User = require("../models/User");
const restrict = (role) => {
  return async(req, res, next) => {
    const user = await User.findById(req.userId)
    if (user.role !== role) {
      return res.status(401).json({message:"You do not have permission for this action"})
    }
    next();
  };
};

module.exports = restrict;
