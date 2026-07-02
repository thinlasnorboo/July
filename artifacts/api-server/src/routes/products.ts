import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListProductsResponse,
  CreateProductBody,
  CreateProductResponse,
  UpdateProductParams,
  UpdateProductBody,
  UpdateProductResponse,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const SEED_PRODUCTS = [
  { name: "Basic Drift RC Car",       description: "Entry-level drift RC car, perfect for beginners. Ready to race out of the box.",          price: 3999,  category: "RC Cars",       featured: true,  inStock: true,  stock: 10, imageUrl: null },
  { name: "4x4 Monster Truck",        description: "High-powered 4x4 monster truck for off-road thrills. Waterproof electronics.",             price: 6999,  category: "RC Cars",       featured: true,  inStock: true,  stock: 5,  imageUrl: null },
  { name: "RC Crawler",               description: "Scale rock crawler with realistic details. Conquers any terrain.",                         price: 5499,  category: "RC Cars",       featured: false, inStock: true,  stock: 8,  imageUrl: null },
  { name: "Competition Drift RC",     description: "Pro-level competition drift car with upgraded motor and drift tyres.",                     price: 9999,  category: "RC Cars",       featured: true,  inStock: false, stock: 0,  imageUrl: null },
  { name: "Bearing Kit (Full Set)",   description: "Complete bearing replacement set for most 1/10 scale RC cars.",                           price: 499,   category: "Parts",         featured: false, inStock: true,  stock: 30, imageUrl: null },
  { name: "Motor Upgrade 540",        description: "High-performance 540 brushed motor upgrade for faster speeds.",                           price: 1299,  category: "Parts",         featured: false, inStock: true,  stock: 15, imageUrl: null },
  { name: "Drift Tyres Set (4pcs)",   description: "Hard compound drift tyres for smooth sliding action.",                                    price: 699,   category: "Parts",         featured: true,  inStock: true,  stock: 25, imageUrl: null },
  { name: "Lexan Body Shell",         description: "Clear polycarbonate body shell, paintable to your custom design.",                        price: 799,   category: "Parts",         featured: false, inStock: true,  stock: 12, imageUrl: null },
  { name: "RC Racing Bag",            description: "Heavy-duty carry bag with foam padding for 1/10 RC cars and accessories.",                price: 1499,  category: "Accessories",   featured: false, inStock: true,  stock: 7,  imageUrl: null },
  { name: "Battery LiPo 2S 5000mAh", description: "High-capacity 2S LiPo battery for extended race sessions.",                              price: 1899,  category: "Accessories",   featured: true,  inStock: true,  stock: 20, imageUrl: null },
  { name: "LA RC Branded Cap",        description: "Embroidered LA RC Cafe cap. One size fits all. Available in black and red.",              price: 399,   category: "Apparel",       featured: false, inStock: true,  stock: 50, imageUrl: null },
  { name: "LA RC T-Shirt",            description: "Premium quality LA RC Cafe T-shirt. Race • Relax • Repeat. Sizes S-XL.",                 price: 599,   category: "Apparel",       featured: false, inStock: true,  stock: 40, imageUrl: null },
];

async function seedIfEmpty() {
  const existing = await db.select().from(productsTable).limit(1);
  if (existing.length === 0) {
    await db.insert(productsTable).values(SEED_PRODUCTS);
  }
}

router.get("/products", async (_req, res): Promise<void> => {
  await seedIfEmpty();
  const rows = await db.select().from(productsTable);
  res.json(ListProductsResponse.parse(rows));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  res.status(201).json(CreateProductResponse.parse(product));
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = UpdateProductBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }
  const [product] = await db
    .update(productsTable)
    .set(body.data)
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(UpdateProductResponse.parse(product));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.sendStatus(204);
});

export default router;
