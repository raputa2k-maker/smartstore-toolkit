"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <div className="space-y-2">
      <Label>카테고리</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="예: 생활/건강>주방용품>잔/컵>머그"
      />
      <p className="text-xs text-muted-foreground">
        스마트스토어 상품 등록 시 선택한 카테고리 경로를 붙여넣으세요
      </p>
    </div>
  );
}
