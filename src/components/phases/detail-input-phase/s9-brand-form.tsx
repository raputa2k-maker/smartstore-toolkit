"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhaseStore } from "@/hooks/use-phase-store";

export function S9BrandForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s9;

  const update = (field: string, value: string) => {
    updateDetailSection("s9", { ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>브랜드 미션 (최대 30자)</Label>
        <Input
          placeholder="예: 자연에서 온 건강함을 모든 가정에"
          value={data.brandMission}
          onChange={(e) => update("brandMission", e.target.value.slice(0, 30))}
          maxLength={30}
        />
        <p className="text-xs text-muted-foreground text-right">
          {data.brandMission.length}/30자
        </p>
      </div>

      <div className="space-y-2">
        <Label>브랜드 스토리</Label>
        <Textarea
          placeholder="브랜드가 시작된 계기, 핵심 가치, 고객에게 전하고 싶은 이야기를 적어주세요"
          value={data.brandStory}
          onChange={(e) => update("brandStory", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>클로징 카피</Label>
        <Textarea
          placeholder="상세페이지 마지막에 들어갈 마무리 멘트&#10;예: 당신의 일상에 작은 변화를 선물하세요"
          value={data.closingCopy}
          onChange={(e) => update("closingCopy", e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label>CTA 버튼 문구</Label>
        <Input
          placeholder="구매하기"
          value={data.ctaText}
          onChange={(e) => update("ctaText", e.target.value)}
        />
      </div>
    </div>
  );
}
