import { auditReports, type AuditReport, type InsertAuditReport } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;
  getAuditReport(id: number): Promise<AuditReport | undefined>;
  getAuditReportsByUrl(url: string): Promise<AuditReport[]>;
  getAllAuditReports(): Promise<AuditReport[]>;
}

export class DatabaseStorage implements IStorage {
  async createAuditReport(insertReport: InsertAuditReport): Promise<AuditReport> {
    const [report] = await db
      .insert(auditReports)
      .values({
        url: insertReport.url,
        seoScore: insertReport.seoScore,
        aiScore: insertReport.aiScore,
        traditionalSeoResults: insertReport.traditionalSeoResults as any,
        geoResults: insertReport.geoResults as any,
        contentSuggestions: insertReport.contentSuggestions as any,
      })
      .returning();
    return report as AuditReport;
  }

  async getAuditReport(id: number): Promise<AuditReport | undefined> {
    const [report] = await db
      .select()
      .from(auditReports)
      .where(eq(auditReports.id, id));
    return report as AuditReport | undefined;
  }

  async getAuditReportsByUrl(url: string): Promise<AuditReport[]> {
    const reports = await db
      .select()
      .from(auditReports)
      .where(eq(auditReports.url, url));
    return reports as AuditReport[];
  }

  async getAllAuditReports(): Promise<AuditReport[]> {
    const reports = await db.select().from(auditReports);
    return reports as AuditReport[];
  }
}

export class MemStorage implements IStorage {
  private reports: Map<number, AuditReport>;
  private currentId: number;

  constructor() {
    this.reports = new Map();
    this.currentId = 1;
  }

  async createAuditReport(insertReport: InsertAuditReport): Promise<AuditReport> {
    const id = this.currentId++;
    const report: AuditReport = {
      id,
      url: insertReport.url,
      seoScore: insertReport.seoScore,
      aiScore: insertReport.aiScore,
      traditionalSeoResults: insertReport.traditionalSeoResults as any,
      geoResults: insertReport.geoResults as any,
      contentSuggestions: insertReport.contentSuggestions as any,
      createdAt: new Date(),
    };
    this.reports.set(id, report);
    return report;
  }

  async getAuditReport(id: number): Promise<AuditReport | undefined> {
    return this.reports.get(id);
  }

  async getAuditReportsByUrl(url: string): Promise<AuditReport[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.url === url,
    );
  }

  async getAllAuditReports(): Promise<AuditReport[]> {
    return Array.from(this.reports.values());
  }
}

export const storage = new DatabaseStorage();
