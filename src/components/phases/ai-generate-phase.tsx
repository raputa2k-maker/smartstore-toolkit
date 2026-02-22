"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhaseNavigation } from "@/components/phase/phase-navigation";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { usePhase } from "@/hooks/use-phase";
import {
  Loader2,
  Sparkles,
  RotateCcw,
  Lightbulb,
  Palette,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/stagger-container";
import { SkeletonCard } from "@/components/motion/skeleton-pulse";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

const SECTION_LABELS: Record<string, string> = {
  s0: "S0: 프리 헤더",
  s1: "S1: 후킹 섹션",
  s2: "S2: 핵심 베네핏",
  s3: "S3: 사회적 증거 1차",
  s4: "S4: 상품 상세 설명",
  s5: "S5: 주문제작 전용",
  s6: "S6: 리뷰",
  s7: "S7: FAQ",
  s8: "S8: 배송/교환/환불",
  s9: "S9: 브랜드 스토리",
};

export function AiGeneratePhase() {
  const { store, setGeneratedPlan } = usePhaseStore();
  const { completeAndNext } = usePhase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generated = store.generated;

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-detail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: store.settings.apiKey,
          model: store.settings.selectedModel,
          productInfo: store.productInfo,
          confirmedName: store.seoCheck.confirmedName,
          seoScore: store.seoCheck.score,
          detailInput: store.detailInput,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "기획안 생성에 실패했습니다.");
        return;
      }

      setGeneratedPlan(data.data);
    } catch {
      setError("네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }, [store.settings, store.productInfo, store.seoCheck, store.detailInput, setGeneratedPlan]);

  const canProceed = generated !== null;

  return (
    <div>
      {/* ─── 생성 전 초기 화면 ─── */}
      {!generated && !loading && !error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <Sparkles className="h-14 w-14 text-primary/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                AI 상세페이지 기획안 생성
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                입력한 정보를 바탕으로 AI가 전환율 높은 상세페이지 기획안을 작성합니다.
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                확정 상품명: <span className="font-medium text-foreground">{store.seoCheck.confirmedName}</span>
              </p>
              <Button onClick={handleGenerate} size="lg">
                <Sparkles className="mr-2 h-4 w-4" />
                기획안 생성하기
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── 로딩 ─── */}
      {loading && (
        <FadeIn>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </FadeIn>
      )}

      {/* ─── 에러 ─── */}
      {error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-6">
              <AlertCircle className="h-10 w-10 text-destructive/60 mx-auto mb-3" />
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button onClick={handleGenerate} variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                다시 시도
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ─── 생성 결과 ─── */}
      {!loading && generated && (
        <StaggerContainer className="space-y-4">
          {/* 상단 요약 */}
          <motion.div variants={staggerItemVariants}>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-medium">
                    기획안이 생성되었습니다
                  </span>
                  <Badge variant="secondary" className="text-xs">
                    {generated.sections.filter((s) => s.enabled).length}개 섹션
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" onClick={handleGenerate}>
                  <RotateCcw className="mr-1 h-3.5 w-3.5" />
                  재생성
                </Button>
              </div>
            </CardContent>
          </Card>
          </motion.div>

          {/* 섹션별 카드 */}
          {generated.sections.map((section) => (
            <motion.div key={section.sectionId} variants={staggerItemVariants}>
            <Card
              className={cn(!section.enabled && "opacity-50")}
            >
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {SECTION_LABELS[section.sectionId] || section.title}
                  </CardTitle>
                  <Badge
                    variant={section.enabled ? "default" : "outline"}
                    className="text-xs"
                  >
                    {section.enabled ? "활성" : "비활성"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 콘텐츠 */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <pre className="text-sm whitespace-pre-wrap break-words font-sans leading-relaxed">
                    {section.content}
                  </pre>
                </div>

                {/* 카피라이팅 팁 */}
                {section.copywritingTips.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Lightbulb className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-medium text-muted-foreground">
                        카피라이팅 팁
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {section.copywritingTips.map((tip, i) => (
                        <li
                          key={i}
                          className="text-xs text-muted-foreground pl-4 relative before:content-[''] before:absolute before:left-1.5 before:top-1.5 before:w-1 before:h-1 before:rounded-full before:bg-amber-400"
                        >
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 디자인 노트 */}
                {section.designNotes && (
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Palette className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-medium text-muted-foreground">
                        디자인 노트
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground pl-4">
                      {section.designNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            </motion.div>
          ))}

          {/* CTA 배치 정보 */}
          {generated.ctaPlacements.length > 0 && (
            <motion.div variants={staggerItemVariants}>
            <Card>
              <CardHeader className="pb-0">
                <div className="flex items-center gap-1.5">
                  <MousePointerClick className="h-4 w-4 text-primary" />
                  <CardTitle className="text-base">CTA 버튼 배치</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {generated.ctaPlacements.map((cta, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 text-sm p-3 bg-muted/50 rounded-lg"
                    >
                      <Badge variant="outline" className="text-xs shrink-0">
                        {SECTION_LABELS[cta.afterSection] || cta.afterSection} 다음
                      </Badge>
                      <span className="font-medium">{cta.ctaText}</span>
                      <Badge variant="secondary" className="text-xs ml-auto">
                        {cta.ctaStyle}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            </motion.div>
          )}
        </StaggerContainer>
      )}

      <PhaseNavigation
        onNext={() => completeAndNext("ai-generate")}
        nextDisabled={!canProceed}
        nextLabel="다음: 미리보기"
      />
    </div>
  );
}
