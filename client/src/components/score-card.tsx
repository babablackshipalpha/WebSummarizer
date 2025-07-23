import { Card, CardContent } from "@/components/ui/card";

interface ScoreCardProps {
  title: string;
  score: number;
  icon: React.ReactNode;
  type: 'seo' | 'ai';
}

export default function ScoreCard({ title, score, icon, type }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 40) return 'text-warning';
    return 'text-error';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 70) return 'Good';
    if (score >= 40) return 'Needs Work';
    return 'Poor';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 70) return 'Above average performance';
    if (score >= 40) return 'Room for improvement';
    return 'Significant issues found';
  };

  const circumference = 2 * Math.PI * 15.9155;
  const strokeDasharray = `${(score / 100) * circumference}, ${circumference}`;

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          {icon}
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={getScoreColor(score)}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={strokeDasharray}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-slate-900">{score}</span>
            </div>
          </div>
          <div>
            <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </p>
            <p className="text-sm text-slate-500">{getScoreDescription(score)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
