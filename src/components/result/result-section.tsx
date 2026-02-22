"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductNameCard } from "./product-name-card";
import type { Recommendation } from "@/types/result";
import { Loader2, ListChecks, AlertCircle } from "lucide-react";

interface ResultSectionProps {
  results: Recommendation[];
  loading: boolean;
  error: string | null;
}

export function ResultSection({ results, loading, error }: ResultSectionProps) {
  if (!loading && !error && results.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="h-5 w-5 text-primary" />
          추천 상품명
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
            <p className="text-sm">AI가 최적화된 상품명을 생성하고 있습니다...</p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-3">
            {results.map((rec, idx) => (
              <ProductNameCard key={idx} recommendation={rec} index={idx} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
