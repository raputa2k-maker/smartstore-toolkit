"use client";

import { useContext, useCallback } from "react";
import { PhaseContext } from "@/lib/phase/phase-context";
import type { PhaseStore, PhaseAction } from "@/types/phase";
import type { ProductInfo } from "@/types/product";
import type { Recommendation } from "@/types/result";
import type { DetailPageInput, GeneratedPlan } from "@/types/detail-page";

export function usePhaseStore() {
  const context = useContext(PhaseContext);
  if (!context) throw new Error("usePhaseStore must be used within PhaseProvider");

  const { store, dispatch } = context;

  const updateSettings = useCallback(
    (data: Partial<PhaseStore["settings"]>) => {
      dispatch({ type: "UPDATE_SETTINGS", payload: data });
    },
    [dispatch]
  );

  const updateProductInfo = useCallback(
    (data: Partial<ProductInfo>) => {
      dispatch({ type: "UPDATE_PRODUCT_INFO", payload: data });
    },
    [dispatch]
  );

  const setSeoResults = useCallback(
    (results: Recommendation[]) => {
      dispatch({ type: "SET_SEO_RESULTS", payload: results });
    },
    [dispatch]
  );

  const selectRecommendation = useCallback(
    (index: number) => {
      dispatch({ type: "SELECT_RECOMMENDATION", payload: index });
    },
    [dispatch]
  );

  const updateSeoCheck = useCallback(
    (data: Partial<PhaseStore["seoCheck"]>) => {
      dispatch({ type: "UPDATE_SEO_CHECK", payload: data });
    },
    [dispatch]
  );

  const updateDetailSection = useCallback(
    <K extends keyof DetailPageInput>(section: K, data: DetailPageInput[K]) => {
      dispatch({ type: "UPDATE_DETAIL_SECTION", payload: { section, data: data as unknown } });
    },
    [dispatch]
  );

  const setGeneratedPlan = useCallback(
    (plan: GeneratedPlan) => {
      dispatch({ type: "SET_GENERATED_PLAN", payload: plan });
    },
    [dispatch]
  );

  const resetAll = useCallback(() => {
    dispatch({ type: "RESET_ALL" });
  }, [dispatch]);

  return {
    store,
    dispatch: dispatch as (action: PhaseAction) => void,
    updateSettings,
    updateProductInfo,
    setSeoResults,
    selectRecommendation,
    updateSeoCheck,
    updateDetailSection,
    setGeneratedPlan,
    resetAll,
  };
}
