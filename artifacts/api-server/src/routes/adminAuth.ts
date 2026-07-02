import { Router, type IRouter } from "express";

const router: IRouter = Router();

const ADMIN_USER_ID = "9622340933";
const ADMIN_PASSWORD = "9931311yY@123";
const ADMIN_TOKEN = "rca_admin_" + Buffer.from(`${ADMIN_USER_ID}:${ADMIN_PASSWORD}`).toString("base64");

router.post("/admin/login", (req, res): void => {
  const { userId, password } = req.body ?? {};
  if (userId === ADMIN_USER_ID && password === ADMIN_PASSWORD) {
    res.json({ token: ADMIN_TOKEN });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.get("/admin/verify", (req, res): void => {
  const auth = req.headers.authorization ?? "";
  const token = auth.replace("Bearer ", "");
  if (token === ADMIN_TOKEN) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ valid: false });
  }
});

export default router;
