"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { Plus, Trash2 } from "lucide-react";
import type { BenefitItem } from "@/types/detail-page";

export function S2BenefitsForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s2;

  const updateBenefit = (index: number, field: keyof BenefitItem, value: string) => {
    const updated = data.benefits.map((b, i) =>
      i === index ? { ...b, [field]: value } : b
    );
    updateDetailSection("s2", { benefits: updated });
  };

  const addBenefit = () => {
    if (data.benefits.length >= 4) return;
    updateDetailSection("s2", {
      benefits: [...data.benefits, { headline: "", description: "", iconKeyword: "" }],
    });
  };

  const removeBenefit = (index: number) => {
    if (data.benefits.length <= 1) return;
    updateDetailSection("s2", {
      benefits: data.benefits.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          핵심 베네핏 <span className="text-destructive">*</span>
        </Label>
        <span className="text-xs text-muted-foreground">
          {data.benefits.length}/4개
        </span>
      </div>

      <AnimatePresence initial={false}>
        {data.benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  베네핏 {index + 1}
                </span>
                {data.benefits.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBenefit(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>헤드라인 (최대 10자)</Label>
                <Input
                  placeholder="예: 초강력 흡수력"
                  value={benefit.headline}
                  onChange={(e) => updateBenefit(index, "headline", e.target.value.slice(0, 10))}
                  maxLength={10}
                />
              </div>

              <div className="space-y-2">
                <Label>설명 (최대 20자)</Label>
                <Input
                  placeholder="예: 일반 제품 대비 3배 흡수"
                  value={benefit.description}
                  onChange={(e) => updateBenefit(index, "description", e.target.value.slice(0, 20))}
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <Label>아이콘 키워드</Label>
                <Input
                  placeholder="예: water-drop, shield, star"
                  value={benefit.iconKeyword}
                  onChange={(e) => updateBenefit(index, "iconKeyword", e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.benefits.length < 4 && (
        <Button
          type="button"
          variant="outline"
          onClick={addBenefit}
          className="w-full"
        >
          <Plus className="mr-1 h-4 w-4" />
          베네핏 추가
        </Button>
      )}
    </div>
  );
}
