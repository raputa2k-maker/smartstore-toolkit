"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CategorySelect } from "@/components/form/category-select";
import { BasicInfoFields } from "@/components/form/basic-info-fields";
import { AttributeFields } from "@/components/form/attribute-fields";
import { KeywordInput } from "@/components/form/keyword-input";
import { CustomOrderToggle } from "@/components/form/custom-order-toggle";
import { PhaseNavigation } from "@/components/phase/phase-navigation";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { usePhase } from "@/hooks/use-phase";

export function ProductInfoPhase() {
  const { store, updateProductInfo } = usePhaseStore();
  const { completeAndNext } = usePhase();
  const info = store.productInfo;

  const canProceed = info.productType.trim().length > 0;

  return (
    <div>
      <Card>
        <CardContent className="p-6 space-y-6">
          <CategorySelect
            value={info.category}
            onChange={(v) => updateProductInfo({ category: v })}
          />

          <BasicInfoFields
            brand={info.brand}
            series={info.series}
            productType={info.productType}
            onBrandChange={(v) => updateProductInfo({ brand: v })}
            onSeriesChange={(v) => updateProductInfo({ series: v })}
            onProductTypeChange={(v) => updateProductInfo({ productType: v })}
          />

          <AttributeFields
            color={info.color}
            material={info.material}
            size={info.size}
            targetGender={info.targetGender}
            additionalAttributes={info.additionalAttributes}
            onColorChange={(v) => updateProductInfo({ color: v })}
            onMaterialChange={(v) => updateProductInfo({ material: v })}
            onSizeChange={(v) => updateProductInfo({ size: v })}
            onTargetGenderChange={(v) => updateProductInfo({ targetGender: v === "none" ? "" : v })}
            onAdditionalAttributesChange={(v) => updateProductInfo({ additionalAttributes: v })}
          />

          <KeywordInput
            keywords={info.keywords}
            onChange={(v) => updateProductInfo({ keywords: v })}
          />

          <CustomOrderToggle
            isCustomOrder={info.isCustomOrder}
            details={info.customOrderDetails}
            onToggle={(v) => updateProductInfo({ isCustomOrder: v })}
            onDetailsChange={(v) => updateProductInfo({ customOrderDetails: v })}
          />
        </CardContent>
      </Card>

      <PhaseNavigation
        onNext={() => completeAndNext("product-info")}
        nextDisabled={!canProceed}
        nextLabel="다음: AI 상품명 생성"
      />
    </div>
  );
}
