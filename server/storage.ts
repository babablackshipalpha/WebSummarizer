import { auditReports, type AuditReport, type InsertAuditReport } from "@shared/schema";

export interface IStorage {
  createAuditReport(report: InsertAuditReport): Promise<AuditReport>;
  getAuditReport(id: number): Promise<AuditReport | undefined>;
  getAuditReportsByUrl(url: string): Promise<AuditReport[]>;
  getAllAuditReports(): Promise<AuditReport[]>;
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
      ...insertReport,
      id,
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

export const storage = new MemStorage();
