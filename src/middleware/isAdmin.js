import User from "../model/userModel.js";
import AppError from "../utils/appError.js";
const isAdmin = async (req, res, next) => {
  // find Login user
  const user = await User.findById(req.userAuth);
  if (user.isAdmin) {
    next();
  } else {
    const error = new AppError(
      "You are not authorized to access this route. Admin only!",
      403,
    );
    next(error);
  }
};

export default isAdmin;
