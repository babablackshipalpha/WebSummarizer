import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { WebScraper } from "./services/web-scraper";
import { SeoAnalyzer } from "./services/seo-analyzer";
import { insertAuditReportSchema } from "@shared/schema";
import { z } from "zod";

const analyzeUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  includeTraditionalSeo: z.boolean().default(true),
  includeGeo: z.boolean().default(true),
  includeContentSuggestions: z.boolean().default(true),
});

export async function registerRoutes(app: Express): Promise<Server> {
  const webScraper = new WebScraper();
  const seoAnalyzer = new SeoAnalyzer();

  // Analyze website endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const { url, includeTraditionalSeo, includeGeo, includeContentSuggestions } = 
        analyzeUrlSchema.parse(req.body);

      // Scrape website data
      const websiteData = await webScraper.scrapeWebsite(url);

      // Analyze traditional SEO
      const traditionalSeoAnalysis = includeTraditionalSeo 
        ? seoAnalyzer.analyzeTraditionalSeo(websiteData)
        : { results: [], score: 0 };

      // Analyze GEO
      const geoAnalysis = includeGeo 
        ? seoAnalyzer.analyzeGeo(websiteData)
        : { results: [], score: 0 };

      // Generate content suggestions
      const contentSuggestions = includeContentSuggestions 
        ? seoAnalyzer.generateContentSuggestions(websiteData)
        : {
            missingKeywords: [],
            blogTitles: [],
            contentStructure: [],
            faqs: [],
            aiVisibility: { chatgpt: 'low' as const, perplexity: 'low' as const, claude: 'low' as const, bard: 'low' as const }
          };

      // Create audit report
      const auditReport = await storage.createAuditReport({
        url,
        seoScore: traditionalSeoAnalysis.score,
        aiScore: geoAnalysis.score,
        traditionalSeoResults: traditionalSeoAnalysis.results,
        geoResults: geoAnalysis.results,
        contentSuggestions,
      });

      res.json(auditReport);
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to analyze website" 
      });
    }
  });

  // Get audit report
  app.get("/api/reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getAuditReport(id);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve report" });
    }
  });

  // Get all audit reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getAllAuditReports();
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve reports" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
