import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const jobs = sqliteTable("jobs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  company: text("company").notNull(),
  role: text("role").notNull(),
  track: text("track").notNull(),
  location: text("location").notNull().default("待确认"),
  eligibility: text("eligibility").notNull().default("待确认"),
  score: integer("score").notNull().default(70),
  status: text("status").notNull().default("待投"),
  deadline: text("deadline"),
  sourceUrl: text("source_url").notNull(),
  nextAction: text("next_action").notNull().default("核验资格并准备投递"),
  lastSeenAt: text("last_seen_at").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("idx_jobs_status_score").on(table.status, table.score),
  index("idx_jobs_last_seen_at").on(table.lastSeenAt),
]);
