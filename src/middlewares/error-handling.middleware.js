import { ErrorClass } from "../utils/error-class.utils.js";

export const errorHandler = (API) => {
  return (req, res, next) => {
    API(req, res, next).catch((err) => {
      next(new ErrorClass("Internal Server error", 500, err.message));
    });
  };
};

export const globaleResponse = (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      message: "Fail response",
      err_msg: err.message,
      err_status: err.status,
      err_data: err.data,
      err_location: err.location,
    });
  }
};
