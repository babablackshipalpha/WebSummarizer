import { useEffect, useState } from "react";
import { CheckCircle, Clock, Loader } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisProgressProps {
  currentUrl: string;
}

export default function AnalysisProgress({ currentUrl }: AnalysisProgressProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: "Scraping website content", icon: CheckCircle },
    { label: "Analyzing SEO elements", icon: Loader },
    { label: "Running GEO analysis", icon: Clock },
    { label: "Generating recommendations", icon: Clock },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + 8, 85);
        const newStep = Math.floor(newProgress / 25);
        setCurrentStep(newStep);
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Analysis in Progress</h3>
          <div className="text-sm text-slate-500">
            Analyzing: <span className="font-mono">{new URL(currentUrl).hostname}</span>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isPending = index > currentStep;
            
            return (
              <div key={index} className="flex items-center justify-between">
                <span className={`text-sm ${isPending ? 'text-slate-400' : 'text-slate-600'}`}>
                  {step.label}
                </span>
                {isCompleted && <CheckCircle className="h-4 w-4 text-success" />}
                {isCurrent && <Loader className="h-4 w-4 text-primary animate-spin" />}
                {isPending && <Clock className="h-4 w-4 text-slate-400" />}
              </div>
            );
          })}
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600">Overall Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
