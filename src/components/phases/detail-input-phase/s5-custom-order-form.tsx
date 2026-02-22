"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { Plus, Trash2 } from "lucide-react";
import type { ProcessStep, CustomOption, RevisionPolicy, ProductionPeriod } from "@/types/detail-page";

export function S5CustomOrderForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s5;

  // ─── Process Steps ────────────────────────────────────────
  const addProcessStep = () => {
    updateDetailSection("s5", {
      ...data,
      processSteps: [...data.processSteps, { step: "", duration: "", description: "" }],
    });
  };

  const updateProcessStep = (index: number, field: keyof ProcessStep, value: string) => {
    const updated = data.processSteps.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    updateDetailSection("s5", { ...data, processSteps: updated });
  };

  const removeProcessStep = (index: number) => {
    if (data.processSteps.length <= 1) return;
    updateDetailSection("s5", {
      ...data,
      processSteps: data.processSteps.filter((_, i) => i !== index),
    });
  };

  // ─── Custom Options ───────────────────────────────────────
  const addCustomOption = () => {
    updateDetailSection("s5", {
      ...data,
      customOptions: [...data.customOptions, { type: "", options: [], note: "" }],
    });
  };

  const updateCustomOption = (index: number, field: keyof CustomOption, value: string | string[]) => {
    const updated = data.customOptions.map((o, i) =>
      i === index ? { ...o, [field]: value } : o
    );
    updateDetailSection("s5", { ...data, customOptions: updated });
  };

  const removeCustomOption = (index: number) => {
    updateDetailSection("s5", {
      ...data,
      customOptions: data.customOptions.filter((_, i) => i !== index),
    });
  };

  // ─── Revision Policy ─────────────────────────────────────
  const updateRevision = (field: keyof RevisionPolicy, value: string | number) => {
    updateDetailSection("s5", {
      ...data,
      revisionPolicy: { ...data.revisionPolicy, [field]: value },
    });
  };

  // ─── Production Period ────────────────────────────────────
  const updatePeriod = (field: keyof ProductionPeriod, value: string) => {
    updateDetailSection("s5", {
      ...data,
      productionPeriod: { ...data.productionPeriod, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      {/* Process Steps */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">제작 과정</Label>
        {data.processSteps.map((step, index) => (
          <div key={index} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                단계 {index + 1}
              </span>
              {data.processSteps.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProcessStep(index)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs">단계명</Label>
                <Input
                  placeholder="예: 원단 선택"
                  value={step.step}
                  onChange={(e) => updateProcessStep(index, "step", e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">소요 시간</Label>
                <Input
                  placeholder="예: 1~2일"
                  value={step.duration}
                  onChange={(e) => updateProcessStep(index, "duration", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">설명</Label>
              <Input
                placeholder="이 단계에서 하는 작업을 설명해 주세요"
                value={step.description}
                onChange={(e) => updateProcessStep(index, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addProcessStep} className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          제작 단계 추가
        </Button>
      </div>

      {/* Custom Options */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">커스텀 옵션</Label>
        {data.customOptions.map((option, index) => (
          <div key={index} className="space-y-3 rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                옵션 {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeCustomOption(index)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">옵션 종류</Label>
              <Input
                placeholder="예: 각인 문구, 색상, 사이즈"
                value={option.type}
                onChange={(e) => updateCustomOption(index, "type", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">선택 가능한 옵션 (쉼표로 구분)</Label>
              <Input
                placeholder="예: 골드, 실버, 로즈골드"
                value={option.options.join(", ")}
                onChange={(e) =>
                  updateCustomOption(
                    index,
                    "options",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">참고 사항</Label>
              <Input
                placeholder="예: 10자 이내 영문/한글 가능"
                value={option.note}
                onChange={(e) => updateCustomOption(index, "note", e.target.value)}
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addCustomOption} className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          커스텀 옵션 추가
        </Button>
      </div>

      {/* Revision Policy */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">수정 정책</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>무료 수정 횟수</Label>
            <Input
              type="number"
              min={0}
              placeholder="2"
              value={data.revisionPolicy.freeRevisions}
              onChange={(e) => updateRevision("freeRevisions", parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label>추가 수정 비용</Label>
            <Input
              placeholder="예: 건당 5,000원"
              value={data.revisionPolicy.extraCost}
              onChange={(e) => updateRevision("extraCost", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>수정 범위</Label>
          <Input
            placeholder="예: 색상, 문구, 레이아웃 변경 가능"
            value={data.revisionPolicy.scope}
            onChange={(e) => updateRevision("scope", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>수정 요청 기한</Label>
          <Input
            placeholder="예: 시안 확인 후 48시간 이내"
            value={data.revisionPolicy.deadline}
            onChange={(e) => updateRevision("deadline", e.target.value)}
          />
        </div>
      </div>

      {/* Production Period */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">제작 기간</Label>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>일반 제작 기간</Label>
            <Input
              placeholder="예: 7~10일"
              value={data.productionPeriod.normalDays}
              onChange={(e) => updatePeriod("normalDays", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>급행 제작 기간</Label>
            <Input
              placeholder="예: 3~5일"
              value={data.productionPeriod.rushDays}
              onChange={(e) => updatePeriod("rushDays", e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>급행 추가 비용</Label>
          <Input
            placeholder="예: 기본가 대비 30% 추가"
            value={data.productionPeriod.rushExtraCost}
            onChange={(e) => updatePeriod("rushExtraCost", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>성수기 안내</Label>
          <Input
            placeholder="예: 명절 시즌(1~2월, 9월)은 2~3일 추가 소요"
            value={data.productionPeriod.peakSeasonNote}
            onChange={(e) => updatePeriod("peakSeasonNote", e.target.value)}
          />
        </div>
      </div>

      {/* Storytelling */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">스토리텔링</Label>
        <Textarea
          placeholder="주문제작 제품에 담긴 이야기를 자유롭게 적어주세요.&#10;예: 고객 한 분 한 분을 위해 수작업으로 만들어지는 과정,&#10;장인의 철학, 소재에 대한 고집 등"
          value={data.storytelling}
          onChange={(e) => updateDetailSection("s5", { ...data, storytelling: e.target.value })}
          rows={5}
        />
      </div>
    </div>
  );
}
