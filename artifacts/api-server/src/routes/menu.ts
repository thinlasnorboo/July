import { Router, type IRouter } from "express";
import { db, menuItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListMenuItemsResponse,
  CreateMenuItemBody,
  CreateMenuItemResponse,
  UpdateMenuItemParams,
  UpdateMenuItemBody,
  UpdateMenuItemResponse,
  DeleteMenuItemParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SEED_ITEMS = [
  // Coffee
  { name: "Espresso", description: "Strong single shot espresso", price: 60, category: "coffee", featured: false, sortOrder: 1 },
  { name: "Americano", description: "Espresso with hot water", price: 80, category: "coffee", featured: false, sortOrder: 2 },
  { name: "Cappuccino", description: "Espresso with steamed milk foam", price: 100, category: "coffee", featured: true, sortOrder: 3 },
  { name: "Cafe Latte", description: "Espresso with steamed milk", price: 110, category: "coffee", featured: false, sortOrder: 4 },
  { name: "Mocha", description: "Espresso with chocolate and milk", price: 120, category: "coffee", featured: false, sortOrder: 5 },
  { name: "Cold Coffee", description: "Chilled classic coffee", price: 120, category: "coffee", featured: true, sortOrder: 6 },
  { name: "Vanilla Cold Coffee", description: "Cold coffee with vanilla flavour", price: 140, category: "coffee", featured: false, sortOrder: 7 },
  { name: "Hazelnut Coffee", description: "Rich hazelnut flavoured coffee", price: 150, category: "coffee", featured: false, sortOrder: 8 },
  // Cold Drinks & Shakes
  { name: "Coke / Sprite", description: "Refreshing cold drink", price: 40, category: "cold_drinks", featured: false, sortOrder: 10 },
  { name: "Lemon Iced Tea", description: "Chilled lemon tea", price: 80, category: "cold_drinks", featured: false, sortOrder: 11 },
  { name: "Peach Iced Tea", description: "Refreshing peach flavoured iced tea", price: 90, category: "cold_drinks", featured: false, sortOrder: 12 },
  { name: "Oreo Shake", description: "Thick Oreo milk shake", price: 120, category: "cold_drinks", featured: true, sortOrder: 13 },
  { name: "Chocolate Shake", description: "Rich chocolate milk shake", price: 130, category: "cold_drinks", featured: false, sortOrder: 14 },
  { name: "KitKat Shake", description: "KitKat flavoured milk shake", price: 140, category: "cold_drinks", featured: false, sortOrder: 15 },
  { name: "Mango Shake", description: "Fresh mango milk shake", price: 120, category: "cold_drinks", featured: false, sortOrder: 16 },
  // Snacks
  { name: "French Fries", description: "Crispy golden fries", price: 80, category: "snacks", featured: false, sortOrder: 20 },
  { name: "Peri Peri Fries", description: "Spicy peri peri seasoned fries", price: 100, category: "snacks", featured: true, sortOrder: 21 },
  { name: "Veg Burger", description: "Fresh veggie burger", price: 100, category: "snacks", featured: false, sortOrder: 22 },
  { name: "Cheese Burger", description: "Classic cheese burger", price: 120, category: "snacks", featured: false, sortOrder: 23 },
  { name: "Veg Sandwich", description: "Fresh veg sandwich", price: 90, category: "snacks", featured: false, sortOrder: 24 },
  { name: "Grilled Sandwich", description: "Grilled veg sandwich", price: 120, category: "snacks", featured: false, sortOrder: 25 },
  { name: "Garlic Bread", description: "Toasted garlic bread", price: 100, category: "snacks", featured: false, sortOrder: 26 },
  { name: "Cheese Garlic Bread", description: "Garlic bread with melted cheese", price: 130, category: "snacks", featured: false, sortOrder: 27 },
  { name: "Maggi", description: "Classic Maggi noodles", price: 60, category: "snacks", featured: false, sortOrder: 28 },
  { name: "Cheese Maggi", description: "Maggi noodles with cheese", price: 90, category: "snacks", featured: false, sortOrder: 29 },
  // Pizza
  { name: "Margherita Pizza", description: "Classic tomato and cheese pizza", price: 150, category: "pizza", featured: false, sortOrder: 30 },
  { name: "Veggie Pizza", description: "Fresh vegetable loaded pizza", price: 180, category: "pizza", featured: false, sortOrder: 31 },
  { name: "Farmhouse Pizza", description: "Rich farmhouse style pizza", price: 220, category: "pizza", featured: true, sortOrder: 32 },
  { name: "Cheese Burst Pizza", description: "Extra cheesy burst pizza", price: 250, category: "pizza", featured: false, sortOrder: 33 },
  // RC Track Charges
  { name: "30 Min Track Access", description: "30 minutes of RC track racing", price: 150, category: "rc_track", featured: false, sortOrder: 40 },
  { name: "1 Hour Track Access", description: "1 full hour of RC track racing", price: 250, category: "rc_track", featured: true, sortOrder: 41 },
  { name: "Full Day Practice", description: "Full day open practice session", price: 700, category: "rc_track", featured: false, sortOrder: 42 },
  { name: "Drift Track Session", description: "Dedicated drift track session", price: 250, category: "rc_track", featured: false, sortOrder: 43 },
  { name: "Event Entry Fee", description: "Entry fee for RC events (onwards)", price: 300, category: "rc_track", featured: false, sortOrder: 44 },
  // RC Car Rental
  { name: "Basic Drift RC", description: "15 minutes basic drift RC car rental", price: 150, category: "rc_rental", featured: false, sortOrder: 50 },
  { name: "4x4 Off-Road RC", description: "15 minutes 4x4 off-road RC car rental", price: 200, category: "rc_rental", featured: true, sortOrder: 51 },
  { name: "Crawler RC", description: "15 minutes crawler RC car rental", price: 250, category: "rc_rental", featured: false, sortOrder: 52 },
  { name: "Competition Drift RC", description: "15 minutes competition drift RC car rental", price: 300, category: "rc_rental", featured: false, sortOrder: 53 },
  // Combo Offers
  { name: "Coffee + Fries", description: "Any coffee with French Fries", price: 150, category: "combo", featured: true, sortOrder: 60 },
  { name: "Cold Coffee + Burger", description: "Cold coffee with any burger", price: 200, category: "combo", featured: false, sortOrder: 61 },
  { name: "RC Track 1hr + Coffee", description: "1 hour track time with any coffee", price: 300, category: "combo", featured: true, sortOrder: 62 },
  { name: "RC Track 1hr + Burger + Drink", description: "1 hour track + burger + cold drink", price: 450, category: "combo", featured: false, sortOrder: 63 },
];

async function seedIfEmpty() {
  const existing = await db.select().from(menuItemsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(menuItemsTable).values(SEED_ITEMS);
  }
}

router.get("/menu", async (_req, res): Promise<void> => {
  await seedIfEmpty();
  const rows = await db.select().from(menuItemsTable).orderBy(menuItemsTable.sortOrder);
  res.json(ListMenuItemsResponse.parse(rows));
});

router.post("/menu", async (req, res): Promise<void> => {
  const parsed = CreateMenuItemBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [item] = await db.insert(menuItemsTable).values(parsed.data).returning();
  res.status(201).json(CreateMenuItemResponse.parse(item));
});

router.patch("/menu/:id", async (req, res): Promise<void> => {
  const params = UpdateMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateMenuItemBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [item] = await db
    .update(menuItemsTable)
    .set(body.data)
    .where(eq(menuItemsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.json(UpdateMenuItemResponse.parse(item));
});

router.delete("/menu/:id", async (req, res): Promise<void> => {
  const params = DeleteMenuItemParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [item] = await db
    .delete(menuItemsTable)
    .where(eq(menuItemsTable.id, params.data.id))
    .returning();
  if (!item) {
    res.status(404).json({ error: "Menu item not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
