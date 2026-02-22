"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhaseStore } from "@/hooks/use-phase-store";

export function S8ShippingForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s8;
  const isCustomOrder = store.productInfo.isCustomOrder;

  const update = (field: string, value: string) => {
    updateDetailSection("s8", { ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>배송 소요일</Label>
        <Input
          placeholder="예: 결제 후 1~3일 이내 출고"
          value={data.deliveryDays}
          onChange={(e) => update("deliveryDays", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>무료 배송 조건</Label>
          <Input
            placeholder="예: 30,000원 이상 무료배송"
            value={data.freeShippingCondition}
            onChange={(e) => update("freeShippingCondition", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>배송비</Label>
          <Input
            placeholder="예: 3,000원"
            value={data.shippingCost}
            onChange={(e) => update("shippingCost", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>교환 정책</Label>
        <Textarea
          placeholder="예: 수령 후 7일 이내 교환 가능&#10;제품 하자 시 무료 교환"
          value={data.exchangePolicy}
          onChange={(e) => update("exchangePolicy", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>환불 정책</Label>
        <Textarea
          placeholder="예: 수령 후 7일 이내 환불 가능&#10;단순 변심 시 반품 배송비 고객 부담"
          value={data.refundPolicy}
          onChange={(e) => update("refundPolicy", e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label>불량/하자 정책</Label>
        <Textarea
          placeholder="예: 제품 불량 시 100% 무상 교환 또는 환불&#10;수령 후 30일 이내 접수"
          value={data.defectPolicy}
          onChange={(e) => update("defectPolicy", e.target.value)}
          rows={2}
        />
      </div>

      {isCustomOrder && (
        <div className="space-y-2">
          <Label>주문제작 상품 반품 안내</Label>
          <Textarea
            placeholder="예: 주문제작 특성상 제작 시작 후에는 교환/환불이 불가합니다.&#10;시안 확인 단계에서 충분히 검토해 주세요."
            value={data.customOrderReturnNote}
            onChange={(e) => update("customOrderReturnNote", e.target.value)}
            rows={3}
          />
        </div>
      )}
    </div>
  );
}
