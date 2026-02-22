"use client";

import { useState, useCallback } from "react";
import type { FormState } from "@/types/product";
import type { Recommendation } from "@/types/result";

export function useGenerate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Recommendation[]>([]);

  const generate = useCallback(async (formState: FormState, apiKey: string) => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          model: formState.selectedModel,
          productInfo: {
            category: formState.category,
            brand: formState.brand,
            series: formState.series,
            productType: formState.productType,
            color: formState.color,
            material: formState.material,
            size: formState.size,
            targetGender: formState.targetGender,
            additionalAttributes: formState.additionalAttributes,
            keywords: formState.keywords,
            isCustomOrder: formState.isCustomOrder,
            customOrderDetails: formState.customOrderDetails,
          },
        }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "상품명 생성에 실패했습니다.");
        return;
      }

      setResults(data.data.recommendations);
    } catch {
      setError("네트워크 오류가 발생했습니다. 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return { loading, error, results, generate, clearResults };
}
