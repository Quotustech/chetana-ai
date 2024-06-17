class ErrorHandler extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;
  success: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
