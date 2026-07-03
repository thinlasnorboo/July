import { Router, type IRouter } from "express";
import { db, bankDetailsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/adminAuth";

const router: IRouter = Router();

const DEFAULT_BANK = {
  accountNo: "216001502780",
  holderName: "THINLAS NORBOO",
  ifscCode: "ICIC0003623",
  bankName: "ICICI Bank",
  upiId: null,
};

async function getOrSeedBank() {
  const rows = await db.select().from(bankDetailsTable).limit(1);
  if (rows.length === 0) {
    const [row] = await db.insert(bankDetailsTable).values(DEFAULT_BANK).returning();
    return row;
  }
  return rows[0];
}

// GET /api/bank-details — public
router.get("/bank-details", async (_req, res): Promise<void> => {
  const row = await getOrSeedBank();
  res.json(row);
});

// PATCH /api/bank-details — admin only
router.patch("/bank-details", requireAdmin, async (req, res): Promise<void> => {

  const row = await getOrSeedBank();
  const { accountNo, holderName, ifscCode, bankName, upiId } = req.body ?? {};
  const [updated] = await db
    .update(bankDetailsTable)
    .set({
      ...(accountNo && { accountNo }),
      ...(holderName && { holderName }),
      ...(ifscCode && { ifscCode }),
      ...(bankName && { bankName }),
      upiId: upiId ?? null,
      updatedAt: new Date(),
    })
    .where(eq(bankDetailsTable.id, row.id))
    .returning();
  res.json(updated);
});

export default router;
