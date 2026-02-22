"use client";

import { useState, useCallback } from "react";
import type { ValidationResult } from "@/types/seo";
import { validateProductName } from "@/lib/seo/validators";

export function useSeoCheck() {
  const [checkResults, setCheckResults] = useState<ValidationResult[]>([]);
  const [hasChecked, setHasChecked] = useState(false);

  const check = useCallback((name: string) => {
    const results = validateProductName(name);
    setCheckResults(results);
    setHasChecked(true);
  }, []);

  const clearCheck = useCallback(() => {
    setCheckResults([]);
    setHasChecked(false);
  }, []);

  return { checkResults, hasChecked, check, clearCheck };
}
