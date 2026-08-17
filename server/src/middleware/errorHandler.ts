import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  const errorObj = err as any;

  // Handle JWT errors
  if (errorObj?.name === "JsonWebTokenError" || errorObj?.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: errorObj.name === "TokenExpiredError" ? "Session expired" : "Invalid session token",
    });
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (errorObj?.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ID format for field '${errorObj.path}'`,
    });
  }

  // Handle Mongoose ValidationError
  if (errorObj?.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Database validation failed",
      details: errorObj.errors,
    });
  }

  // Handle MongoDB Duplicate Key error (E11000)
  if (errorObj?.code === 11000) {
    const field = Object.keys(errorObj.keyValue || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `An entry with this ${field} already exists`,
    });
  }

  // Handle malformed JSON body
  if (err instanceof SyntaxError && "body" in errorObj) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON in request body",
    });
  }

  console.error("[NoVAult] Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    stack: env.isProd ? undefined : (err as Error)?.stack,
  });
}
