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
import slidesRouter from "./slides";

const router: IRouter = Router();

router.use(healthRouter);
router.use(adminAuthRouter);
router.use(servicesRouter);
router.use(galleryRouter);
router.use(menuRouter);
router.use(productsRouter);
router.use(contactRouter);
router.use(bookingsRouter);
router.use(statsRouter);
router.use(slidesRouter);

export default router;
