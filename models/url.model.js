import { pgTable, uuid, text, timestamp, integer, varchar } from "drizzle-orm/pg-core";
import { userstable } from './user.model.js';


export const urlsTable = pgTable('urls', {
    id: uuid("id").defaultRandom().primaryKey(),
    shortcode: varchar("code", { length: 155 }).notNull().unique(),
    targetURL: text("target_url").notNull(),
    userID: uuid("user_id").references(() => userstable.id).notNull(),
    clicks: integer("clicks").default(0).notNull(),
    lastClickedAt: timestamp("last_clicked_at"),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});


