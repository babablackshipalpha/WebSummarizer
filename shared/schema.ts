import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const auditReports = pgTable("audit_reports", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  seoScore: integer("seo_score").notNull(),
  aiScore: integer("ai_score").notNull(),
  traditionalSeoResults: jsonb("traditional_seo_results").$type<TraditionalSeoResult[]>().notNull(),
  geoResults: jsonb("geo_results").$type<GeoResult[]>().notNull(),
  contentSuggestions: jsonb("content_suggestions").$type<ContentSuggestions>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAuditReportSchema = createInsertSchema(auditReports).omit({
  id: true,
  createdAt: true,
});

export type InsertAuditReport = z.infer<typeof insertAuditReportSchema>;
export type AuditReport = typeof auditReports.$inferSelect;

// Type definitions for audit results
export interface TraditionalSeoResult {
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
  details?: string;
  metrics?: Record<string, string | number>;
}

export interface GeoResult {
  type: 'success' | 'warning' | 'error';
  title: string;
  description: string;
  details?: string;
}

export interface ContentSuggestions {
  missingKeywords: string[];
  blogTitles: Array<{
    title: string;
    target: string;
  }>;
  contentStructure: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  aiVisibility: {
    chatgpt: 'low' | 'medium' | 'high';
    perplexity: 'low' | 'medium' | 'high';
    claude: 'low' | 'medium' | 'high';
    bard: 'low' | 'medium' | 'high';
  };
}

export interface WebsiteData {
  title: string;
  metaDescription: string;
  headings: Array<{
    level: number;
    text: string;
  }>;
  images: Array<{
    src: string;
    alt: string;
    hasAlt: boolean;
  }>;
  links: Array<{
    href: string;
    text: string;
    isInternal: boolean;
  }>;
  content: string;
  hasSchema: boolean;
  schemaTypes: string[];
  loadTime: number;
  wordCount: number;
}
