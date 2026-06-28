import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const downloads = pgTable("downloads", {
  id: serial("id").primaryKey(),
  originalUrl: text("original_url").notNull(),
  platform: text("platform").notNull(),
  downloadUrl: text("download_url"),
  filename: text("filename"),
  status: text("status").notNull().default("pending"),
  videoQuality: text("video_quality").default("1080"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
