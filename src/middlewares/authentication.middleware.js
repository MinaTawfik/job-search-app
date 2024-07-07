import jwt from "jsonwebtoken"
import User from "../../database/models/user.model.js";
import { ErrorClass } from "../utils/error-class.utils.js";

export const auth = () => {
  return async (req, res, next) => {
    
    // destruct token from headers
    const { token } = req.headers;

    // check if token is exists
    if (!token) {
      return next(new ErrorClass("Token is required", 404, "Token is required"));
    }

    // decode token
    const decodedData = jwt.verify(token, process.env.LOGIN_SECRET);

    // check if token payload has userId
    if (!decodedData?.userId) {
      return next(new ErrorClass("Invalid token data", 400, "Invalid token data"));
    }

    // find user by userId
    const isUserExists = await User.findById(decodedData?.userId);
    if (!isUserExists) {
      return next(new ErrorClass("User not found", 404, "User not found"));
    }

    
    // check if user is loggedin
    if (isUserExists.isLogged == 'false') {
      return next(new ErrorClass("Please login first", 404, "Please login first"));
    }

    // add the user data in req object
    req.authUser = isUserExists;

    next();
  };
};
