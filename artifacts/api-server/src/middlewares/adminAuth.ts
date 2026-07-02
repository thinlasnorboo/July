import { type Request, type Response, type NextFunction } from "express";

const ADMIN_USER_ID = "9622340933";
const ADMIN_PASSWORD = "9931311yY@123";
export const ADMIN_TOKEN = "rca_admin_" + Buffer.from(`${ADMIN_USER_ID}:${ADMIN_PASSWORD}`).toString("base64");

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization ?? "";
  const token = auth.replace("Bearer ", "");
  if (token === ADMIN_TOKEN) {
    next();
    return;
  }
  res.status(401).json({ error: "Unauthorized" });
}
