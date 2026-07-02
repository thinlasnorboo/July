import { Router, type IRouter } from "express";
import { db, bookingsTable, productsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { GetStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats", async (_req, res): Promise<void> => {
  const [totalRes] = await db.select({ count: count() }).from(bookingsTable);
  const [confirmedRes] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "confirmed"));
  const [pendingRes] = await db.select({ count: count() }).from(bookingsTable).where(eq(bookingsTable.status, "pending"));
  const [productsRes] = await db.select({ count: count() }).from(productsTable);

  const stats = {
    totalBookings:     totalRes?.count ?? 0,
    confirmedBookings: confirmedRes?.count ?? 0,
    pendingBookings:   pendingRes?.count ?? 0,
    totalTracks:       3,
    memberCount:       500,
    totalProducts:     productsRes?.count ?? 0,
    yearsOpen:         1,
  };

  res.json(GetStatsResponse.parse(stats));
});

export default router;
