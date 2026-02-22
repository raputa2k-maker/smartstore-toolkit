import { Badge } from "@/components/ui/badge";

interface SeoScoreBadgeProps {
  score: number;
}

export function SeoScoreBadge({ score }: SeoScoreBadgeProps) {
  let color: string;
  let label: string;

  if (score >= 90) {
    color = "bg-emerald-100 text-emerald-700 border-emerald-200";
    label = "우수";
  } else if (score >= 70) {
    color = "bg-amber-100 text-amber-700 border-amber-200";
    label = "양호";
  } else {
    color = "bg-red-100 text-red-700 border-red-200";
    label = "개선필요";
  }

  return (
    <Badge variant="outline" className={`${color} font-medium`}>
      SEO {score}점 · {label}
    </Badge>
  );
}
