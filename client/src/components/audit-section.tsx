import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { TraditionalSeoResult, GeoResult } from "@shared/schema";

interface AuditSectionProps {
  title: string;
  icon: React.ReactNode;
  results: (TraditionalSeoResult | GeoResult)[];
  children?: React.ReactNode;
}

export default function AuditSection({ title, icon, results, children }: AuditSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success mt-0.5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-error mt-0.5" />;
      default:
        return null;
    }
  };

  const getResultBackground = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-amber-50 border-amber-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <Card>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900 flex items-center">
            {icon}
            <span className="ml-3">{title}</span>
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-slate-600"
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {isExpanded && (
        <CardContent className="p-6">
          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`flex items-start space-x-3 p-4 border rounded-lg ${getResultBackground(result.type)}`}
              >
                {getResultIcon(result.type)}
                <div className="flex-1">
                  <h4 className="font-medium text-slate-900">{result.title}</h4>
                  <p className="text-sm text-slate-600 mt-1">{result.description}</p>
                  {result.details && (
                    <div className="mt-2">
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded font-mono">
                        {result.details}
                      </span>
                    </div>
                  )}
                  {'metrics' in result && result.metrics && (
                    <div className="mt-2 space-x-2">
                      {Object.entries(result.metrics).map(([key, value]) => (
                        <span key={key} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {children}
        </CardContent>
      )}
    </Card>
  );
}
