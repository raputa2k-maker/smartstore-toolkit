"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeoScoreBadge } from "./seo-score-badge";
import { ViolationAlert } from "./violation-alert";
import type { Recommendation } from "@/types/result";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ProductNameCardProps {
  recommendation: Recommendation;
  index: number;
}

export function ProductNameCard({
  recommendation,
  index,
}: ProductNameCardProps) {
  const [copied, setCopied] = useState(false);
  const { name, reasoning, charCount, seoScore, keywords, violations } =
    recommendation;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(name);
    setCopied(true);
    toast.success("상품명이 복사되었습니다.");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                {index + 1}
              </span>
              <SeoScoreBadge score={seoScore} />
              <Badge variant="outline" className="text-xs">
                {charCount}자
              </Badge>
            </div>

            <p className="text-base font-medium text-foreground break-keep leading-relaxed">
              {name}
            </p>

            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {keywords.map((kw, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="text-xs px-1.5 py-0"
                  >
                    {kw}
                  </Badge>
                ))}
              </div>
            )}

            <p className="text-xs text-muted-foreground mt-2">{reasoning}</p>

            <ViolationAlert violations={violations} />
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="shrink-0"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
