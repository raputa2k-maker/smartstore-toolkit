"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckResult } from "@/components/checker/check-result";
import { PhaseNavigation } from "@/components/phase/phase-navigation";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { usePhase } from "@/hooks/use-phase";
import { useSeoCheck } from "@/hooks/use-seo-check";
import { ShieldCheck } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/motion/fade-in";
import { calculateSeoScore } from "@/lib/seo/score-calculator";

export function SeoCheckPhase() {
  const { store, updateSeoCheck } = usePhaseStore();
  const { completeAndNext } = usePhase();
  const { checkResults, hasChecked, check, clearCheck } = useSeoCheck();

  const { recommendations, selectedIndex } = store.seoResult;
  const selectedName = selectedIndex !== null ? recommendations[selectedIndex]?.name ?? "" : "";

  // Auto-fill from selected recommendation
  useEffect(() => {
    if (selectedName && !store.seoCheck.confirmedName) {
      updateSeoCheck({ confirmedName: selectedName });
    }
  }, [selectedName, store.seoCheck.confirmedName, updateSeoCheck]);

  // Auto-check when name is set
  useEffect(() => {
    if (store.seoCheck.confirmedName.trim() && !hasChecked) {
      check(store.seoCheck.confirmedName.trim());
    }
  }, [store.seoCheck.confirmedName, hasChecked, check]);

  const handleNameChange = (name: string) => {
    updateSeoCheck({ confirmedName: name, isConfirmed: false });
    clearCheck();
  };

  const handleRecheck = () => {
    if (store.seoCheck.confirmedName.trim()) {
      check(store.seoCheck.confirmedName.trim());
    }
  };

  const handleConfirm = () => {
    const score = selectedIndex !== null ? recommendations[selectedIndex]?.seoScore ?? 0 : 0;
    updateSeoCheck({ isConfirmed: true, score, violations: checkResults });
    completeAndNext("seo-check");
  };

  return (
    <div>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span className="font-medium text-sm">선택한 상품명의 SEO 가이드라인 준수 여부를 확인합니다.</span>
          </div>

          <div className="space-y-2">
            <Label>확정할 상품명</Label>
            <div className="flex gap-2">
              <Input
                value={store.seoCheck.confirmedName}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="상품명을 입력하거나 수정하세요"
                className="flex-1"
              />
              <Button variant="outline" onClick={handleRecheck} disabled={!store.seoCheck.confirmedName.trim()}>
                재검사
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              필요 시 상품명을 수정한 후 재검사할 수 있습니다.
            </p>
          </div>

          <AnimatePresence>
            {hasChecked && (
              <FadeIn key="check-result">
                <CheckResult results={checkResults} />
              </FadeIn>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <PhaseNavigation
        onNext={handleConfirm}
        nextDisabled={!store.seoCheck.confirmedName.trim()}
        nextLabel="상품명 확정 → 상세페이지 정보 입력"
      />
    </div>
  );
}
