import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const bankDetailsTable = pgTable("bank_details", {
  id: serial("id").primaryKey(),
  accountNo: text("account_no").notNull(),
  holderName: text("holder_name").notNull(),
  ifscCode: text("ifsc_code").notNull(),
  bankName: text("bank_name").notNull().default("ICICI Bank"),
  upiId: text("upi_id"),
  updatedAt: timestamp("updated_at").defaultNow(),
});
