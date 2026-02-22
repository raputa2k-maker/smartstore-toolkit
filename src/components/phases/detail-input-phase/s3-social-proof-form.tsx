"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { Plus, Trash2 } from "lucide-react";

export function S3SocialProofForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s3;

  const update = (field: string, value: string) => {
    updateDetailSection("s3", { ...data, [field]: value });
  };

  const addArrayItem = (field: "awards" | "certifications" | "mediaExposure") => {
    updateDetailSection("s3", { ...data, [field]: [...data[field], ""] });
  };

  const updateArrayItem = (field: "awards" | "certifications" | "mediaExposure", index: number, value: string) => {
    const updated = data[field].map((item, i) => (i === index ? value : item));
    updateDetailSection("s3", { ...data, [field]: updated });
  };

  const removeArrayItem = (field: "awards" | "certifications" | "mediaExposure", index: number) => {
    updateDetailSection("s3", { ...data, [field]: data[field].filter((_, i) => i !== index) });
  };

  const renderArrayField = (
    label: string,
    field: "awards" | "certifications" | "mediaExposure",
    placeholder: string,
    addLabel: string
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      {data[field].map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <Input
            placeholder={placeholder}
            value={item}
            onChange={(e) => updateArrayItem(field, index, e.target.value)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => removeArrayItem(field, index)}
            className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => addArrayItem(field)}
      >
        <Plus className="mr-1 h-4 w-4" />
        {addLabel}
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>누적 판매 수</Label>
        <Input
          placeholder="예: 50,000개"
          value={data.salesCount}
          onChange={(e) => update("salesCount", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>평점</Label>
        <Input
          placeholder="예: 4.8"
          value={data.rating}
          onChange={(e) => update("rating", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>랭킹 정보</Label>
        <Input
          placeholder="예: 카테고리 1위, 베스트셀러"
          value={data.rankingInfo}
          onChange={(e) => update("rankingInfo", e.target.value)}
        />
      </div>

      {renderArrayField("수상 내역", "awards", "예: 2024 대한민국 브랜드 대상", "수상 내역 추가")}
      {renderArrayField("인증 정보", "certifications", "예: KC 인증, ISO 9001", "인증 추가")}
      {renderArrayField("미디어 노출", "mediaExposure", "예: MBC 생방송 오늘 아침 소개", "미디어 노출 추가")}
    </div>
  );
}
