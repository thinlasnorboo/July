import { Router, type IRouter } from "express";
import { ListGalleryItemsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const GALLERY_ITEMS = [
  { id: 1,  title: "Main RC Circuit",       category: "track",  imageUrl: null },
  { id: 2,  title: "Drift Action",          category: "track",  imageUrl: null },
  { id: 3,  title: "RC Car Fleet",          category: "cars",   imageUrl: null },
  { id: 4,  title: "Cafe Corner",           category: "cafe",   imageUrl: null },
  { id: 5,  title: "Championship Race",     category: "events", imageUrl: null },
  { id: 6,  title: "Track Day Fun",         category: "track",  imageUrl: null },
  { id: 7,  title: "Coffee Station",        category: "cafe",   imageUrl: null },
  { id: 8,  title: "Monster Truck Action",  category: "cars",   imageUrl: null },
  { id: 9,  title: "Night Race Series",     category: "events", imageUrl: null },
  { id: 10, title: "Pit Lane Setup",        category: "track",  imageUrl: null },
  { id: 11, title: "RC Car Close Up",       category: "cars",   imageUrl: null },
  { id: 12, title: "Birthday Celebration",  category: "events", imageUrl: null },
];

router.get("/gallery", async (_req, res): Promise<void> => {
  res.json(ListGalleryItemsResponse.parse(GALLERY_ITEMS));
});

export default router;
