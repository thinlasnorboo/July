import { Router, type IRouter } from "express";
import { db, heroSlidesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

const DEFAULT_SLIDES = [
  { imageUrl: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=2940&auto=format&fit=crop", title: "Race. Relax. Repeat.", subtitle: "India's Premier RC Car Racing Experience", sortOrder: 0, active: true },
  { imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2940&auto=format&fit=crop", title: "Hit the Track", subtitle: "Professional RC tracks open 7 days a week", sortOrder: 1, active: true },
  { imageUrl: "https://images.unsplash.com/photo-1567789884554-0b844b597180?q=80&w=2940&auto=format&fit=crop", title: "Fuel Up & Race", subtitle: "Great food, great coffee, great racing", sortOrder: 2, active: true },
];

async function seedIfEmpty() {
  const existing = await db.select().from(heroSlidesTable).limit(1);
  if (existing.length === 0) {
    await db.insert(heroSlidesTable).values(DEFAULT_SLIDES);
  }
}

router.get("/slides", async (_req, res): Promise<void> => {
  await seedIfEmpty();
  const rows = await db.select().from(heroSlidesTable).orderBy(heroSlidesTable.sortOrder);
  res.json(rows);
});

router.post("/slides", async (req, res): Promise<void> => {
  const { imageUrl, title = "", subtitle = "", sortOrder = 0, active = true } = req.body ?? {};
  if (!imageUrl) { res.status(400).json({ error: "imageUrl required" }); return; }
  const [slide] = await db.insert(heroSlidesTable).values({ imageUrl, title, subtitle, sortOrder, active }).returning();
  res.status(201).json(slide);
});

router.patch("/slides/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  const { imageUrl, title, subtitle, sortOrder, active } = req.body ?? {};
  const update: Record<string, unknown> = {};
  if (imageUrl !== undefined) update.imageUrl = imageUrl;
  if (title !== undefined) update.title = title;
  if (subtitle !== undefined) update.subtitle = subtitle;
  if (sortOrder !== undefined) update.sortOrder = sortOrder;
  if (active !== undefined) update.active = active;
  const [slide] = await db.update(heroSlidesTable).set(update).where(eq(heroSlidesTable.id, id)).returning();
  if (!slide) { res.status(404).json({ error: "Not found" }); return; }
  res.json(slide);
});

router.delete("/slides/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
  await db.delete(heroSlidesTable).where(eq(heroSlidesTable.id, id));
  res.sendStatus(204);
});

export default router;
