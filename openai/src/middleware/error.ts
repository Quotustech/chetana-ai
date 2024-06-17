import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // wrong mongodb id error
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // Duplicate key error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    statusCode = 400;
  }

  // wrong jwt error
  if (err.name === "JsonWebTokenError") {
    message = `Json web token is invalid, try again`;
    statusCode = 400;
  }

  // JWT expired error
  if (err.name === "JWTExpiredError") {
    message = `Json web token is expired, try again`;
    statusCode = 400;
  }

  const errorHandler = new ErrorHandler(message, statusCode);
  res.status(errorHandler.statusCode).json({
    status: errorHandler.statusCode,
    success: false,
    message: errorHandler.message,
  });
};
