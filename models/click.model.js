import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { urlsTable } from './url.model.js';

export const clicksTable = pgTable('clicks', {
    id: uuid("id").defaultRandom().primaryKey(),
    urlId: uuid("url_id").references(() => urlsTable.id).notNull(),
    clickedAt: timestamp("clicked_at").defaultNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    referer: text("referer"),
    country: text("country"),
    city: text("city"),
});
