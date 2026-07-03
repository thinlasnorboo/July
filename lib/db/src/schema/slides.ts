import { boolean, integer, pgTable, serial, text } from "drizzle-orm/pg-core";

export const heroSlidesTable = pgTable("hero_slides", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  title: text("title").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export type HeroSlide = typeof heroSlidesTable.$inferSelect;
export type InsertHeroSlide = typeof heroSlidesTable.$inferInsert;
