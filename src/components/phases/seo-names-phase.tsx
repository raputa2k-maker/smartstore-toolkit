"use client";

import { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SeoScoreBadge } from "@/components/result/seo-score-badge";
import { ViolationAlert } from "@/components/result/violation-alert";
import { PhaseNavigation } from "@/components/phase/phase-navigation";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { usePhase } from "@/hooks/use-phase";
import type { Recommendation } from "@/types/result";
import { Loader2, Sparkles, Copy, Check, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/stagger-container";
import { SkeletonCard } from "@/components/motion/skeleton-pulse";
import { FadeIn } from "@/components/motion/fade-in";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SeoNamesPhase() {
  const { store, setSeoResults, selectRecommendation } = usePhaseStore();
  const { completeAndNext } = usePhase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const { recommendations, selectedIndex } = store.seoResult;

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: store.settings.apiKey,
          model: store.settings.selectedModel,
          productInfo: store.productInfo,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "상품명 생성에 실패했습니다.");
        return;
      }
      setSeoResults(data.data.recommendations);
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [store.settings, store.productInfo, setSeoResults]);

  const handleCopy = async (name: string, idx: number) => {
    await navigator.clipboard.writeText(name);
    setCopiedIdx(idx);
    toast.success("상품명이 복사되었습니다.");
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const canProceed = selectedIndex !== null;

  return (
    <div>
      {/* Generate Button */}
      {recommendations.length === 0 && !loading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <Sparkles className="h-12 w-12 text-primary/40 mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                입력한 상품 정보를 바탕으로 AI가 SEO 최적화된 상품명 5개를 추천합니다.
              </p>
              <Button onClick={handleGenerate} disabled={loading} size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                상품명 생성하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading */}
      {loading && (
        <FadeIn>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </FadeIn>
      )}

      {/* Error */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-sm text-destructive py-4">{error}</div>
            <div className="flex justify-center">
              <Button onClick={handleGenerate} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!loading && recommendations.length > 0 && (
        <StaggerContainer className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              상품명을 클릭하여 선택하세요. 선택한 상품명이 기획안에 반영됩니다.
            </p>
            <Button variant="ghost" size="sm" onClick={handleGenerate}>
              <RotateCcw className="mr-1 h-3.5 w-3.5" />
              재생성
            </Button>
          </div>

          {recommendations.map((rec: Recommendation, idx: number) => (
            <motion.div key={idx} variants={staggerItemVariants}>
            <Card
              className={cn(
                "cursor-pointer transition-all",
                selectedIndex === idx
                  ? "ring-2 ring-primary border-primary shadow-md"
                  : "hover:shadow-sm hover:border-primary/30"
              )}
              onClick={() => selectRecommendation(idx)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <motion.span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold shrink-0",
                          selectedIndex === idx
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                        animate={{ scale: selectedIndex === idx ? [1, 1.2, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {selectedIndex === idx ? "✓" : idx + 1}
                      </motion.span>
                      <SeoScoreBadge score={rec.seoScore} />
                      <Badge variant="outline" className="text-xs">
                        {rec.charCount}자
                      </Badge>
                      {selectedIndex === idx && (
                        <Badge className="text-xs bg-primary">선택됨</Badge>
                      )}
                    </div>
                    <p className="text-base font-medium text-foreground break-keep leading-relaxed">
                      {rec.name}
                    </p>
                    {rec.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {rec.keywords.map((kw, ki) => (
                          <Badge key={ki} variant="secondary" className="text-xs px-1.5 py-0">
                            {kw}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">{rec.reasoning}</p>
                    <ViolationAlert violations={rec.violations} />
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(rec.name, idx);
                    }}
                  >
                    {copiedIdx === idx ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </StaggerContainer>
      )}

      <PhaseNavigation
        onNext={() => completeAndNext("seo-names")}
        nextDisabled={!canProceed}
        nextLabel="다음: SEO 검증"
      />
    </div>
  );
}
