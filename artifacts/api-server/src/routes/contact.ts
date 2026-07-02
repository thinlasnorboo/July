import { Router, type IRouter } from "express";
import { db, contactMessagesTable } from "@workspace/db";
import { SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/contact", async (_req, res): Promise<void> => {
  const msgs = await db.select().from(contactMessagesTable).orderBy(contactMessagesTable.createdAt);
  res.json(msgs);
});

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [msg] = await db.insert(contactMessagesTable).values(parsed.data).returning();
  res.status(201).json(msg);
});

export default router;
