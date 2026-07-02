import { Router, type IRouter } from "express";
import healthRouter from "./health";
import bookingsRouter from "./bookings";
import servicesRouter from "./services";
import menuRouter from "./menu";
import galleryRouter from "./gallery";
import contactRouter from "./contact";
import statsRouter from "./stats";
import adminAuthRouter from "./adminAuth";
import productsRouter from "./products";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

// Public routes
router.use(healthRouter);
router.use(adminAuthRouter);
router.use(servicesRouter);
router.use(galleryRouter);

// Public reads, protected writes handled inside each router
router.use(menuRouter);
router.use(productsRouter);
router.use(contactRouter);
router.use(bookingsRouter);
router.use(statsRouter);

// Protected admin-only listing routes (extra guard)
router.get("/admin/bookings", requireAdmin, async (_req, res) => {
  res.redirect("/api/bookings");
});

export default router;
