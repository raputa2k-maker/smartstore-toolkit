"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GENDER_OPTIONS } from "@/lib/seo/constants";

interface AttributeFieldsProps {
  color: string;
  material: string;
  size: string;
  targetGender: string;
  additionalAttributes: string;
  onColorChange: (value: string) => void;
  onMaterialChange: (value: string) => void;
  onSizeChange: (value: string) => void;
  onTargetGenderChange: (value: string) => void;
  onAdditionalAttributesChange: (value: string) => void;
}

export function AttributeFields({
  color,
  material,
  size,
  targetGender,
  additionalAttributes,
  onColorChange,
  onMaterialChange,
  onSizeChange,
  onTargetGenderChange,
  onAdditionalAttributesChange,
}: AttributeFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <div className="space-y-2">
          <Label>색상</Label>
          <Input
            placeholder="예: 화이트, 블랙"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>소재</Label>
          <Input
            placeholder="예: 가죽, 실버925"
            value={material}
            onChange={(e) => onMaterialChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>사이즈/규격</Label>
          <Input
            placeholder="예: 270mm, L, 1200"
            value={size}
            onChange={(e) => onSizeChange(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>성별/타겟</Label>
          <Select value={targetGender} onValueChange={onTargetGenderChange}>
            <SelectTrigger>
              <SelectValue placeholder="선택 안함" />
            </SelectTrigger>
            <SelectContent>
              {GENDER_OPTIONS.map((opt) => (
                <SelectItem key={opt.value || "none"} value={opt.value || "none"}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>추가 속성</Label>
        <Input
          placeholder="예: 보온, USB-C, 오크, 500ml"
          value={additionalAttributes}
          onChange={(e) => onAdditionalAttributesChange(e.target.value)}
        />
      </div>
    </div>
  );
}
