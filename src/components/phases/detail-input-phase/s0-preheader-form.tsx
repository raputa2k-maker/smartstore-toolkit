"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { usePhaseStore } from "@/hooks/use-phase-store";

export function S0PreheaderForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s0;

  const update = (field: string, value: string | boolean) => {
    updateDetailSection("s0", { ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Switch
          id="preheader-enabled"
          checked={data.enabled}
          onCheckedChange={(checked) => update("enabled", checked)}
        />
        <Label htmlFor="preheader-enabled" className="cursor-pointer">
          프리헤더 섹션 사용
        </Label>
      </div>

      {data.enabled && (
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>
              프로모션 문구 <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="예: 오늘만 특가! 한정 수량 할인"
              value={data.promotionText}
              onChange={(e) => update("promotionText", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>할인율</Label>
            <Input
              placeholder="예: 30%"
              value={data.discountRate}
              onChange={(e) => update("discountRate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>마감 기한</Label>
            <Input
              placeholder="예: 2024년 12월 31일까지"
              value={data.deadline}
              onChange={(e) => update("deadline", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>쿠폰 정보</Label>
            <Textarea
              placeholder="예: 첫 구매 시 5,000원 할인 쿠폰 자동 적용&#10;리뷰 작성 시 1,000원 적립금 지급"
              value={data.couponInfo}
              onChange={(e) => update("couponInfo", e.target.value)}
              rows={3}
            />
          </div>
        </div>
      )}
    </div>
  );
}
