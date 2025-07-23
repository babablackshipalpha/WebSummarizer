import { TrendingUp, TrendingDown, ArrowRight, CheckCircle, AlertTriangle, Target, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ScoreCard from "./score-card";
import type { ComparisonResult } from "@shared/schema";

interface ComparisonResultsProps {
  result: ComparisonResult;
}

export default function ComparisonResults({ result }: ComparisonResultsProps) {
  const { url1Report, url2Report, url1AiVisibility, url2AiVisibility, differences } = result;
  
  const getScoreDifferenceIcon = (diff: number) => {
    if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (diff < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <div className="h-4 w-4" />; // Equal scores
  };

  const getScoreDifferenceColor = (diff: number) => {
    if (diff > 0) return "text-green-600";
    if (diff < 0) return "text-red-600";
    return "text-slate-600";
  };

  const getDifferenceDescription = () => {
    const betterUrl = differences.betterPerformer === 'url1' ? url1Report.url : url2Report.url;
    const domain = new URL(betterUrl).hostname;
    return `${domain} performs better overall`;
  };

  return (
    <div className="space-y-8">
      {/* Overall Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 text-primary mr-2" />
            Website Performance Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <p className="text-lg font-medium text-slate-900 mb-2">
              {getDifferenceDescription()}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-slate-600">
              <span>{new URL(url1Report.url).hostname}</span>
              <ArrowRight className="h-4 w-4" />
              <span>{new URL(url2Report.url).hostname}</span>
            </div>
          </div>
          
          {/* Score Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{url1Report.seoScore}</div>
              <div className="text-sm text-slate-600">SEO Score</div>
              <div className="text-xs text-slate-500 mt-1">{new URL(url1Report.url).hostname}</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{url2Report.seoScore}</div>
              <div className="text-sm text-slate-600">SEO Score</div>
              <div className="text-xs text-slate-500 mt-1">{new URL(url2Report.url).hostname}</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{url1Report.aiScore}</div>
              <div className="text-sm text-slate-600">AI Score</div>
              <div className="text-xs text-slate-500 mt-1">{new URL(url1Report.url).hostname}</div>
            </div>
            
            <div className="text-center p-4 bg-slate-50 rounded-lg">
              <div className="text-2xl font-bold text-slate-900">{url2Report.aiScore}</div>
              <div className="text-sm text-slate-600">AI Score</div>
              <div className="text-xs text-slate-500 mt-1">{new URL(url2Report.url).hostname}</div>
            </div>

            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{url1AiVisibility.overallScore}</div>
              <div className="text-sm text-blue-600">AI Platform Score</div>
              <div className="text-xs text-slate-500 mt-1">{new URL(url1Report.url).hostname}</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">{url2AiVisibility.overallScore}</div>
              <div className="text-sm text-blue-600">AI Platform Score</div>
              <div className="text-xs text-slate-500 mt-1">{new URL(url2Report.url).hostname}</div>
            </div>
          </div>

          {/* Score Differences */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
              <span className="font-medium">SEO Score Difference</span>
              <div className="flex items-center space-x-2">
                {getScoreDifferenceIcon(differences.seoScoreDiff)}
                <span className={`font-bold ${getScoreDifferenceColor(differences.seoScoreDiff)}`}>
                  {differences.seoScoreDiff > 0 ? '+' : ''}{differences.seoScoreDiff}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white border rounded-lg">
              <span className="font-medium">AI Visibility Difference</span>
              <div className="flex items-center space-x-2">
                {getScoreDifferenceIcon(differences.aiScoreDiff)}
                <span className={`font-bold ${getScoreDifferenceColor(differences.aiScoreDiff)}`}>
                  {differences.aiScoreDiff > 0 ? '+' : ''}{differences.aiScoreDiff}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="font-medium">AI Platform Visibility Difference</span>
              <div className="flex items-center space-x-2">
                {getScoreDifferenceIcon(differences.aiVisibilityDiff)}
                <span className={`font-bold ${getScoreDifferenceColor(differences.aiVisibilityDiff)}`}>
                  {differences.aiVisibilityDiff > 0 ? '+' : ''}{differences.aiVisibilityDiff}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Differences Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Key Differences Analysis</CardTitle>
          <p className="text-sm text-slate-600">
            Understand why one website performs better than the other
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {differences.keyDifferences.map((diff, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-slate-900">{diff.aspect}</h4>
                  <Badge variant={diff.category === 'seo' ? 'default' : 'secondary'}>
                    {diff.category === 'seo' ? 'SEO' : 
                     diff.category === 'ai' ? 'AI Optimization' : 'Content'}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="text-xs text-slate-500 mb-1">
                      {new URL(url1Report.url).hostname}
                    </div>
                    <div className="font-medium text-slate-900">{diff.url1Value}</div>
                  </div>
                  
                  <div className="p-3 bg-slate-50 rounded">
                    <div className="text-xs text-slate-500 mb-1">
                      {new URL(url2Report.url).hostname}
                    </div>
                    <div className="font-medium text-slate-900">{diff.url2Value}</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded">
                  <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">{diff.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Platform Visibility Detailed Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bot className="h-5 w-5 text-blue-600 mr-2" />
            AI Platform Visibility Assessment
          </CardTitle>
          <p className="text-sm text-slate-600">
            12-factor analysis for ChatGPT, Perplexity, Claude, and Bard optimization
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Website 1 AI Visibility */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                {new URL(url1Report.url).hostname} - Score: {url1AiVisibility.overallScore}/100
              </h4>
              <p className="text-sm text-slate-600 mb-4">{url1AiVisibility.summary}</p>
              
              <div className="space-y-3">
                {url1AiVisibility.factors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{factor.factor}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{factor.score}/100</span>
                        <Badge 
                          variant={factor.status === 'pass' ? 'default' : 
                                  factor.status === 'warning' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {factor.status === 'pass' ? 'Pass' : 
                           factor.status === 'warning' ? 'Warning' : 'Fail'}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={factor.score} className="mb-2" />
                    <p className="text-xs text-slate-600">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Website 2 AI Visibility */}
            <div>
              <h4 className="font-medium text-slate-900 mb-4 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                {new URL(url2Report.url).hostname} - Score: {url2AiVisibility.overallScore}/100
              </h4>
              <p className="text-sm text-slate-600 mb-4">{url2AiVisibility.summary}</p>
              
              <div className="space-y-3">
                {url2AiVisibility.factors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{factor.factor}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{factor.score}/100</span>
                        <Badge 
                          variant={factor.status === 'pass' ? 'default' : 
                                  factor.status === 'warning' ? 'secondary' : 'destructive'}
                          className="text-xs"
                        >
                          {factor.status === 'pass' ? 'Pass' : 
                           factor.status === 'warning' ? 'Warning' : 'Fail'}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={factor.score} className="mb-2" />
                    <p className="text-xs text-slate-600">{factor.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
            Improvement Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-900 mb-3">
                For {new URL(url1Report.url).hostname}:
              </h4>
              <div className="space-y-2">
                {url1AiVisibility.recommendations?.slice(0, 4).map((recommendation, index) => (
                  <div key={index} className={`p-3 rounded border-l-4 ${
                    recommendation.priority === 'high' ? 'bg-red-50 border-red-400' :
                    recommendation.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm">{recommendation.action}</div>
                      <Badge variant={recommendation.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {recommendation.priority === 'high' ? 'High' : 
                         recommendation.priority === 'medium' ? 'Medium' : 'Low'} Priority
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">{recommendation.description}</div>
                    <div className="text-xs text-slate-500 italic">{recommendation.impact}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-slate-900 mb-3">
                For {new URL(url2Report.url).hostname}:
              </h4>
              <div className="space-y-2">
                {url2AiVisibility.recommendations?.slice(0, 4).map((recommendation, index) => (
                  <div key={index} className={`p-3 rounded border-l-4 ${
                    recommendation.priority === 'high' ? 'bg-red-50 border-red-400' :
                    recommendation.priority === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                    'bg-green-50 border-green-400'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-sm">{recommendation.action}</div>
                      <Badge variant={recommendation.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                        {recommendation.priority === 'high' ? 'High' : 
                         recommendation.priority === 'medium' ? 'Medium' : 'Low'} Priority
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-600 mb-1">{recommendation.description}</div>
                    <div className="text-xs text-slate-500 italic">{recommendation.impact}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}