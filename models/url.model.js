import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import {userstable} from './user.model.js';
import { varchar } from "drizzle-orm/pg-core";

export const urlsTable = pgTable('urls', {
    id: uuid("id").defaultRandom().primaryKey(),
    shortcode: varchar("code", {length: 155}).notNull().unique(),
    targetURL: text("target_url").notNull(),
    userID: uuid("user_id").references(() => userstable.id).notNull(),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

