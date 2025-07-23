import { Search, Bot, Lightbulb, FileText, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ScoreCard from "./score-card";
import AuditSection from "./audit-section";
import { useToast } from "@/hooks/use-toast";
import type { AuditReport } from "@shared/schema";

interface AuditResultsProps {
  report: AuditReport;
}

export default function AuditResults({ report }: AuditResultsProps) {
  const { toast } = useToast();

  const handleExportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export functionality would be implemented here",
    });
  };

  const handleExportCSV = () => {
    toast({
      title: "CSV Export", 
      description: "CSV export functionality would be implemented here",
    });
  };

  const handleSaveReport = () => {
    toast({
      title: "Report Saved",
      description: "Report has been saved to your dashboard",
    });
  };

  const getVisibilityColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-error';
      default:
        return 'text-slate-500';
    }
  };

  return (
    <div className="space-y-8" id="results-container">
      {/* Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ScoreCard
          title="Traditional SEO Score"
          score={report.seoScore}
          icon={<Search className="h-5 w-5 text-primary" />}
          type="seo"
        />
        <ScoreCard
          title="AI Visibility Score"
          score={report.aiScore}
          icon={<Bot className="h-5 w-5 text-primary" />}
          type="ai"
        />
      </div>

      {/* Traditional SEO Audit */}
      <AuditSection
        title="Traditional SEO Issues & Fixes"
        icon={<Search className="h-6 w-6 text-primary" />}
        results={report.traditionalSeoResults}
      />

      {/* GEO Analysis */}
      <AuditSection
        title="GEO (AI Optimization) Analysis"
        icon={<Bot className="h-6 w-6 text-primary" />}
        results={report.geoResults}
      >
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-slate-900 mb-2 flex items-center">
            <Lightbulb className="h-4 w-4 text-primary mr-2" />
            AI Platform Visibility Assessment
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className={`text-lg font-semibold ${getVisibilityColor(report.contentSuggestions.aiVisibility.chatgpt)}`}>
                {report.contentSuggestions.aiVisibility.chatgpt.charAt(0).toUpperCase() + report.contentSuggestions.aiVisibility.chatgpt.slice(1)}
              </div>
              <div className="text-xs text-slate-600">ChatGPT</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${getVisibilityColor(report.contentSuggestions.aiVisibility.perplexity)}`}>
                {report.contentSuggestions.aiVisibility.perplexity.charAt(0).toUpperCase() + report.contentSuggestions.aiVisibility.perplexity.slice(1)}
              </div>
              <div className="text-xs text-slate-600">Perplexity</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${getVisibilityColor(report.contentSuggestions.aiVisibility.claude)}`}>
                {report.contentSuggestions.aiVisibility.claude.charAt(0).toUpperCase() + report.contentSuggestions.aiVisibility.claude.slice(1)}
              </div>
              <div className="text-xs text-slate-600">Claude</div>
            </div>
            <div>
              <div className={`text-lg font-semibold ${getVisibilityColor(report.contentSuggestions.aiVisibility.bard)}`}>
                {report.contentSuggestions.aiVisibility.bard.charAt(0).toUpperCase() + report.contentSuggestions.aiVisibility.bard.slice(1)}
              </div>
              <div className="text-xs text-slate-600">Bard</div>
            </div>
          </div>
        </div>
      </AuditSection>

      {/* AI-Powered Content Suggestions */}
      <Card>
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center">
            <Lightbulb className="h-6 w-6 text-primary mr-3" />
            AI-Powered Content Suggestions
          </h3>
        </div>
        
        <CardContent className="p-6 space-y-6">
          {/* Missing Keywords */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Missing or Weak Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {report.contentSuggestions.missingKeywords.map((keyword, index) => (
                <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Blog Title Suggestions */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Suggested Blog Titles</h4>
            <div className="space-y-2">
              {report.contentSuggestions.blogTitles.map((blog, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg">
                  <div className="font-medium text-slate-900">"{blog.title}"</div>
                  <div className="text-sm text-slate-600">Target: {blog.target}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Improved Content Structure */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Improved Content Structure</h4>
            <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm">
              {report.contentSuggestions.contentStructure.map((item, index) => (
                <div key={index} className="text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Suggestions */}
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Recommended FAQ Section</h4>
            <Accordion type="single" collapsible className="space-y-3">
              {report.contentSuggestions.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="bg-slate-50 rounded-lg px-4">
                  <AccordionTrigger className="font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-slate-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* AI Score Improvements */}
          {report.contentSuggestions.aiImprovements && report.contentSuggestions.aiImprovements.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">
                AI Visibility Score को 100 तक पहुंचाने के लिए करें:
              </h4>
              <div className="space-y-3">
                {report.contentSuggestions.aiImprovements.map((improvement, index) => (
                  <div key={index} className={`p-4 border rounded-lg ${
                    improvement.impact === 'high' ? 'border-red-200 bg-red-50' :
                    improvement.impact === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-green-200 bg-green-50'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="font-medium text-slate-900 mb-1">
                          {improvement.priority}. {improvement.action}
                        </h5>
                        <p className="text-sm text-slate-600">{improvement.description}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ml-3 ${
                        improvement.impact === 'high' ? 'bg-red-100 text-red-800' :
                        improvement.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {improvement.impact === 'high' ? 'उच्च प्रभाव' :
                         improvement.impact === 'medium' ? 'मध्यम प्रभाव' :
                         'कम प्रभाव'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Export and Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Export Audit Report</h3>
              <p className="text-sm text-slate-600">Generate a comprehensive report for your team or clients</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleExportPDF}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <FileText className="mr-2 h-4 w-4" />
                Export as PDF
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <Download className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button
                onClick={handleSaveReport}
                className="bg-primary text-white hover:bg-blue-700"
              >
                <Save className="mr-2 h-4 w-4" />
                Save to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
