import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const userstable = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firstname: text("first_name").notNull(),
  lastname: text("last_name"),
  email: text("email").notNull(),
  password: text("password").notNull(),
  salt: text("salt").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
