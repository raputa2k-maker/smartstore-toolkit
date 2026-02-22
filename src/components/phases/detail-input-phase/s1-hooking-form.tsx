"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { cn } from "@/lib/utils";
import type { HookingType } from "@/types/detail-page";

const HOOKING_TYPES: { type: HookingType; label: string; description: string; example: string }[] = [
  {
    type: "problem",
    label: "문제해결형",
    description: "고객의 문제를 짚어 공감을 유도",
    example: "혹시 이런 고민 있으신가요?\n매일 반복되는 OO 때문에 지치셨다면...",
  },
  {
    type: "result",
    label: "결과제시형",
    description: "사용 후 달라질 결과를 먼저 보여줌",
    example: "사용 3일 만에 달라진 OO\n이미 10만 명이 경험한 변화",
  },
  {
    type: "scarcity",
    label: "희소성형",
    description: "한정 수량·기간으로 긴급감 조성",
    example: "오늘 단 100개 한정!\n이 가격은 다시 오지 않습니다",
  },
  {
    type: "authority",
    label: "권위형",
    description: "전문가·기관 인증으로 신뢰 확보",
    example: "피부과 전문의가 직접 개발한 OO\nKS 인증 획득, 특허 등록 제품",
  },
  {
    type: "story",
    label: "스토리형",
    description: "브랜드 스토리로 감성적 연결",
    example: "작은 공방에서 시작된 10년의 장인 정신\n할머니의 레시피를 그대로 담았습니다",
  },
];

export function S1HookingForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s1;

  const update = (field: string, value: string) => {
    updateDetailSection("s1", { ...data, [field]: value });
  };

  const selectedType = HOOKING_TYPES.find((t) => t.type === data.hookingType);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>
          후킹 유형 선택 <span className="text-destructive">*</span>
        </Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {HOOKING_TYPES.map(({ type, label, description }) => (
            <button
              key={type}
              type="button"
              onClick={() => updateDetailSection("s1", { ...data, hookingType: type })}
              className={cn(
                "rounded-lg border p-3 text-left text-sm transition-colors",
                data.hookingType === type
                  ? "border-primary bg-primary/5 text-foreground"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-medium">{label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          메인 카피 <span className="text-destructive">*</span>
        </Label>
        <Textarea
          placeholder={selectedType?.example ?? "메인 후킹 카피를 입력해 주세요"}
          value={data.mainCopy}
          onChange={(e) => update("mainCopy", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>서브 카피</Label>
        <Input
          placeholder="메인 카피를 보조하는 한 줄 문구"
          value={data.subCopy}
          onChange={(e) => update("subCopy", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>히어로 이미지 설명</Label>
        <Textarea
          placeholder="메인 비주얼 이미지를 설명해 주세요&#10;예: 제품을 손에 들고 있는 모델 컷, 밝은 자연광 배경"
          value={data.heroImageDescription}
          onChange={(e) => update("heroImageDescription", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
