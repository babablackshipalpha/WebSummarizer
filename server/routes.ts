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

const compareUrlSchema = z.object({
  url1: z.string().url("Please enter a valid URL for first website"),
  url2: z.string().url("Please enter a valid URL for second website"),
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
        ? seoAnalyzer.generateContentSuggestions(websiteData, geoAnalysis.score)
        : {
            missingKeywords: [],
            blogTitles: [],
            contentStructure: [],
            faqs: [],
            aiVisibility: { chatgpt: 'low' as const, perplexity: 'low' as const, claude: 'low' as const, bard: 'low' as const },
            aiImprovements: []
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

  // Compare two websites
  app.post("/api/compare", async (req, res) => {
    try {
      const { url1, url2, includeTraditionalSeo, includeGeo, includeContentSuggestions } = 
        compareUrlSchema.parse(req.body);

      // Scrape both websites
      const [websiteData1, websiteData2] = await Promise.all([
        webScraper.scrapeWebsite(url1),
        webScraper.scrapeWebsite(url2)
      ]);

      // Analyze first website
      const traditionalSeoAnalysis1 = includeTraditionalSeo 
        ? seoAnalyzer.analyzeTraditionalSeo(websiteData1)
        : { results: [], score: 0 };
      
      const geoAnalysis1 = includeGeo 
        ? seoAnalyzer.analyzeGeo(websiteData1)
        : { results: [], score: 0 };

      const contentSuggestions1 = includeContentSuggestions 
        ? seoAnalyzer.generateContentSuggestions(websiteData1, geoAnalysis1.score)
        : {
            missingKeywords: [],
            blogTitles: [],
            contentStructure: [],
            faqs: [],
            aiVisibility: { chatgpt: 'low' as const, perplexity: 'low' as const, claude: 'low' as const, bard: 'low' as const },
            aiImprovements: []
          };

      // Analyze second website
      const traditionalSeoAnalysis2 = includeTraditionalSeo 
        ? seoAnalyzer.analyzeTraditionalSeo(websiteData2)
        : { results: [], score: 0 };
      
      const geoAnalysis2 = includeGeo 
        ? seoAnalyzer.analyzeGeo(websiteData2)
        : { results: [], score: 0 };

      const contentSuggestions2 = includeContentSuggestions 
        ? seoAnalyzer.generateContentSuggestions(websiteData2, geoAnalysis2.score)
        : {
            missingKeywords: [],
            blogTitles: [],
            contentStructure: [],
            faqs: [],
            aiVisibility: { chatgpt: 'low' as const, perplexity: 'low' as const, claude: 'low' as const, bard: 'low' as const },
            aiImprovements: []
          };

      // Create audit reports
      const [url1Report, url2Report] = await Promise.all([
        storage.createAuditReport({
          url: url1,
          seoScore: traditionalSeoAnalysis1.score,
          aiScore: geoAnalysis1.score,
          traditionalSeoResults: traditionalSeoAnalysis1.results,
          geoResults: geoAnalysis1.results,
          contentSuggestions: contentSuggestions1,
        }),
        storage.createAuditReport({
          url: url2,
          seoScore: traditionalSeoAnalysis2.score,
          aiScore: geoAnalysis2.score,
          traditionalSeoResults: traditionalSeoAnalysis2.results,
          geoResults: geoAnalysis2.results,
          contentSuggestions: contentSuggestions2,
        })
      ]);

      // Analyze AI Platform Visibility for both websites
      const [url1AiVisibility, url2AiVisibility] = [
        seoAnalyzer.analyzeAiPlatformVisibility(websiteData1),
        seoAnalyzer.analyzeAiPlatformVisibility(websiteData2)
      ];

      // Generate comparison analysis
      const differences = seoAnalyzer.compareWebsites(
        websiteData1, url1Report, 
        websiteData2, url2Report,
        url1AiVisibility, url2AiVisibility
      );

      const comparisonResult = {
        url1Report,
        url2Report,
        url1AiVisibility,
        url2AiVisibility,
        differences
      };

      res.json(comparisonResult);
    } catch (error) {
      console.error("Comparison error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to compare websites" 
      });
    }
  });

  // Get all audit reports
  app.get("/api/audit-reports", async (req, res) => {
    try {
      const reports = await storage.getAllAuditReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching audit reports:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch audit reports" 
      });
    }
  });

  // Get audit reports by URL
  app.get("/api/audit-reports/url", async (req, res) => {
    try {
      const { url } = req.query;
      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: "URL parameter is required" });
      }
      const reports = await storage.getAuditReportsByUrl(url);
      res.json(reports);
    } catch (error) {
      console.error("Error fetching audit reports by URL:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch audit reports" 
      });
    }
  });

  // Get specific audit report by ID
  app.get("/api/audit-reports/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      const report = await storage.getAuditReport(id);
      if (!report) {
        return res.status(404).json({ message: "Audit report not found" });
      }
      res.json(report);
    } catch (error) {
      console.error("Error fetching audit report:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to fetch audit report" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
