import { Request, Response, NextFunction } from "express";

function cleanObject(obj: any): void {
  if (!obj || typeof obj !== "object") return;
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete obj[key];
    } else if (typeof obj[key] === "object" && obj[key] !== null) {
      cleanObject(obj[key]);
    }
  }
}

/**
 * Middleware to sanitize inputs and mitigate NoSQL injection risks.
 * Recursively strips keys starting with '$' or containing '.' in req.body, req.query, and req.params.
 */
export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === "object") cleanObject(req.body);
  if (req.query && typeof req.query === "object") cleanObject(req.query);
  if (req.params && typeof req.params === "object") cleanObject(req.params);
  next();
}
