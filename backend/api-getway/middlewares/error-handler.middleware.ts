import { Request, Response, NextFunction } from "express";
import { GrpcError } from "../errors/grpc.errors";
import { ValidationError } from "../errors/validation.errors";
import { NotFoundError } from "../errors/not-found.errors";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[${new Date().toISOString()}] Error:`, error);

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: "Validation Error",
      message: error.message,
      details: error.details,
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      error: "Not Found",
      message: error.message,
    });
  }

  if (error instanceof GrpcError) {
    return res.status(502).json({
      error: "Service Communication Error",
      message: error.message,
      service: error.service,
      code: error.code,
    });
  }

  // Default error handler
  res.status(500).json({
    error: "Internal Server Error",
    message: "An unexpected error occurred",
  });
}
