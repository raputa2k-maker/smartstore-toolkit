"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BasicInfoFieldsProps {
  brand: string;
  series: string;
  productType: string;
  onBrandChange: (value: string) => void;
  onSeriesChange: (value: string) => void;
  onProductTypeChange: (value: string) => void;
}

export function BasicInfoFields({
  brand,
  series,
  productType,
  onBrandChange,
  onSeriesChange,
  onProductTypeChange,
}: BasicInfoFieldsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label>브랜드명</Label>
        <Input
          placeholder="예: 나이키, 삼성"
          value={brand}
          onChange={(e) => onBrandChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>시리즈/모델명</Label>
        <Input
          placeholder="예: 에어맥스 90, 갤럭시 S24"
          value={series}
          onChange={(e) => onSeriesChange(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label>
          상품유형 <span className="text-destructive">*</span>
        </Label>
        <Input
          placeholder="예: 러닝화, 케이스, 원피스"
          value={productType}
          onChange={(e) => onProductTypeChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
}
