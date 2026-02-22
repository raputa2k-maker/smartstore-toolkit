"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategorySelect } from "./category-select";
import { BasicInfoFields } from "./basic-info-fields";
import { AttributeFields } from "./attribute-fields";
import { KeywordInput } from "./keyword-input";
import { CustomOrderToggle } from "./custom-order-toggle";
import { ModelSelector } from "./model-selector";
import { useApiKey } from "@/hooks/use-api-key";
import { type FormState, initialFormState } from "@/types/product";
import type { ModelKey } from "@/lib/gemini/client";
import { Loader2, Sparkles, RotateCcw } from "lucide-react";

interface ProductFormProps {
  onSubmit: (formState: FormState, apiKey: string) => void;
  loading: boolean;
}

export function ProductForm({ onSubmit, loading }: ProductFormProps) {
  const [form, setForm] = useState<FormState>(initialFormState);
  const { apiKey, saveKey, updateApiKey, toggleSave } = useApiKey();

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productType.trim()) return;
    if (!apiKey.trim()) return;
    onSubmit(form, apiKey);
  };

  const handleReset = () => {
    setForm(initialFormState);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          상품 정보 입력
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <CategorySelect
            value={form.category}
            onChange={(v) => update("category", v)}
          />

          <BasicInfoFields
            brand={form.brand}
            series={form.series}
            productType={form.productType}
            onBrandChange={(v) => update("brand", v)}
            onSeriesChange={(v) => update("series", v)}
            onProductTypeChange={(v) => update("productType", v)}
          />

          <AttributeFields
            color={form.color}
            material={form.material}
            size={form.size}
            targetGender={form.targetGender}
            additionalAttributes={form.additionalAttributes}
            onColorChange={(v) => update("color", v)}
            onMaterialChange={(v) => update("material", v)}
            onSizeChange={(v) => update("size", v)}
            onTargetGenderChange={(v) => update("targetGender", v === "none" ? "" : v)}
            onAdditionalAttributesChange={(v) =>
              update("additionalAttributes", v)
            }
          />

          <KeywordInput
            keywords={form.keywords}
            onChange={(v) => update("keywords", v)}
          />

          <CustomOrderToggle
            isCustomOrder={form.isCustomOrder}
            details={form.customOrderDetails}
            onToggle={(v) => update("isCustomOrder", v)}
            onDetailsChange={(v) => update("customOrderDetails", v)}
          />

          <ModelSelector
            selectedModel={form.selectedModel}
            apiKey={apiKey}
            saveKey={saveKey}
            onModelChange={(v: ModelKey) => update("selectedModel", v)}
            onApiKeyChange={updateApiKey}
            onSaveKeyToggle={toggleSave}
          />

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !form.productType.trim() || !apiKey.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  상품명 생성하기
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={loading}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              초기화
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
