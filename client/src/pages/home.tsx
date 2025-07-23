import { useState } from "react";
import { Search, User, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UrlInputForm from "@/components/url-input-form";
import UrlComparisonForm from "@/components/url-comparison-form";
import AnalysisProgress from "@/components/analysis-progress";
import AuditResults from "@/components/audit-results";
import ComparisonResults from "@/components/comparison-results";
import type { AuditReport, ComparisonResult } from "@shared/schema";

export default function Home() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [compareUrls, setCompareUrls] = useState({ url1: "", url2: "" });
  const [auditReport, setAuditReport] = useState<AuditReport | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [activeTab, setActiveTab] = useState("analyze");

  const handleAnalysisStart = (url: string) => {
    setCurrentUrl(url);
    setIsAnalyzing(true);
    setAuditReport(null);
    setComparisonResult(null);
  };

  const handleAnalysisComplete = (report: AuditReport) => {
    setIsAnalyzing(false);
    setAuditReport(report);
  };

  const handleAnalysisError = () => {
    setIsAnalyzing(false);
  };

  const handleComparisonStart = (url1: string, url2: string) => {
    setCompareUrls({ url1, url2 });
    setIsComparing(true);
    setComparisonResult(null);
    setAuditReport(null);
  };

  const handleComparisonComplete = (result: ComparisonResult) => {
    setIsComparing(false);
    setComparisonResult(result);
  };

  const handleComparisonError = () => {
    setIsComparing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-slate-900">SEO & GEO Audit Tool</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Dashboard</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">History</a>
              <a href="#" className="text-slate-600 hover:text-primary transition-colors">Reports</a>
              <Button className="bg-primary text-white hover:bg-blue-700">
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analyze" className="flex items-center">
              <Search className="h-4 w-4 mr-2" />
              Single Website Analysis
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Website Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6">
            <UrlInputForm 
              onAnalysisStart={handleAnalysisStart} 
              onAnalysisComplete={handleAnalysisComplete} 
              onAnalysisError={handleAnalysisError} 
            />
            
            {isAnalyzing && <AnalysisProgress currentUrl={currentUrl} />}
            
            {auditReport && <AuditResults report={auditReport} />}
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <UrlComparisonForm 
              onComparisonStart={handleComparisonStart} 
              onComparisonComplete={handleComparisonComplete} 
              onComparisonError={handleComparisonError} 
            />
            
            {isComparing && (
              <div className="text-center py-8">
                <div className="inline-flex items-center space-x-2 text-primary">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span>Comparing websites...</span>
                </div>
                <p className="text-sm text-slate-600 mt-2">
                  Analyzing {new URL(compareUrls.url1).hostname} vs {new URL(compareUrls.url2).hostname}
                </p>
              </div>
            )}
            
            {comparisonResult && <ComparisonResults result={comparisonResult} />}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Search className="h-3 w-3 text-white" />
              </div>
              <span className="text-slate-600">SEO & GEO Audit Tool</span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-500">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-primary transition-colors">API Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
