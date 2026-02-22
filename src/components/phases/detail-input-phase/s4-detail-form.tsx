"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { Plus, Trash2 } from "lucide-react";
import type { ComparisonRow } from "@/types/detail-page";

export function S4DetailForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s4;

  const updateField = (field: string, value: string) => {
    updateDetailSection("s4", { ...data, [field]: value });
  };

  // Usage Steps
  const addStep = () => {
    updateDetailSection("s4", { ...data, usageSteps: [...data.usageSteps, ""] });
  };

  const updateStep = (index: number, value: string) => {
    const updated = data.usageSteps.map((s, i) => (i === index ? value : s));
    updateDetailSection("s4", { ...data, usageSteps: updated });
  };

  const removeStep = (index: number) => {
    if (data.usageSteps.length <= 1) return;
    updateDetailSection("s4", { ...data, usageSteps: data.usageSteps.filter((_, i) => i !== index) });
  };

  // Comparison Points
  const addComparison = () => {
    updateDetailSection("s4", {
      ...data,
      comparisonPoints: [...data.comparisonPoints, { attribute: "", ours: "", theirs: "" }],
    });
  };

  const updateComparison = (index: number, field: keyof ComparisonRow, value: string) => {
    const updated = data.comparisonPoints.map((row, i) =>
      i === index ? { ...row, [field]: value } : row
    );
    updateDetailSection("s4", { ...data, comparisonPoints: updated });
  };

  const removeComparison = (index: number) => {
    updateDetailSection("s4", {
      ...data,
      comparisonPoints: data.comparisonPoints.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>소재/원료 설명</Label>
        <Textarea
          placeholder="예: 100% 유기농 면, OEKO-TEX 인증 원단 사용&#10;피부에 닿는 안감은 대나무 섬유로 제작"
          value={data.materialDescription}
          onChange={(e) => updateField("materialDescription", e.target.value)}
          rows={3}
        />
      </div>

      {/* Usage Steps */}
      <div className="space-y-2">
        <Label>사용 방법 / 단계</Label>
        {data.usageSteps.map((step, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-muted-foreground w-8">
              {index + 1}.
            </span>
            <Input
              placeholder={`${index + 1}단계를 입력하세요`}
              value={step}
              onChange={(e) => updateStep(index, e.target.value)}
            />
            {data.usageSteps.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStep(index)}
                className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addStep}>
          <Plus className="mr-1 h-4 w-4" />
          단계 추가
        </Button>
      </div>

      {/* Comparison Table */}
      <div className="space-y-2">
        <Label>비교 포인트 (자사 vs 타사)</Label>
        {data.comparisonPoints.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 text-xs font-medium text-muted-foreground px-1">
              <span>비교 항목</span>
              <span>자사 제품</span>
              <span>타사 제품</span>
              <span className="w-9" />
            </div>
            {data.comparisonPoints.map((row, index) => (
              <div key={index} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                <Input
                  placeholder="예: 원산지"
                  value={row.attribute}
                  onChange={(e) => updateComparison(index, "attribute", e.target.value)}
                />
                <Input
                  placeholder="예: 국내산"
                  value={row.ours}
                  onChange={(e) => updateComparison(index, "ours", e.target.value)}
                />
                <Input
                  placeholder="예: 수입산"
                  value={row.theirs}
                  onChange={(e) => updateComparison(index, "theirs", e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeComparison(index)}
                  className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <Button type="button" variant="outline" size="sm" onClick={addComparison}>
          <Plus className="mr-1 h-4 w-4" />
          비교 항목 추가
        </Button>
      </div>

      <div className="space-y-2">
        <Label>상세 이미지 설명</Label>
        <Textarea
          placeholder="예: 제품 클로즈업 샷, 사이즈 비교 이미지, 패키지 언박싱 컷 등&#10;상세페이지에 들어갈 이미지를 설명해 주세요"
          value={data.detailImageDescription}
          onChange={(e) => updateField("detailImageDescription", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
