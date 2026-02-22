"use client";

import { useContext } from "react";
import { PhaseContext } from "@/lib/phase/phase-context";
import { getSortedConfigs } from "@/lib/phase/phase-config";
import type { PhaseId, PhaseStatus } from "@/types/phase";

export function usePhase() {
  const context = useContext(PhaseContext);
  if (!context) throw new Error("usePhase must be used within PhaseProvider");

  const { phaseState, goToPhase, completeAndNext } = context;
  const configs = getSortedConfigs();
  const currentIndex = configs.findIndex((c) => c.id === phaseState.currentPhaseId);
  const currentConfig = configs[currentIndex];

  const canGoPrev = currentIndex > 0;

  const canGoNext = (phaseId?: PhaseId): boolean => {
    const id = phaseId ?? phaseState.currentPhaseId;
    const status = phaseState.statuses[id];
    if (status === "completed") return true;
    const config = configs.find((c) => c.id === id);
    return config?.canSkip ?? false;
  };

  const goNext = () => {
    if (currentIndex < configs.length - 1) {
      completeAndNext(phaseState.currentPhaseId);
    }
  };

  const goPrev = () => {
    if (canGoPrev) {
      goToPhase(configs[currentIndex - 1].id);
    }
  };

  const goTo = (phaseId: PhaseId) => {
    const status = phaseState.statuses[phaseId];
    if (status !== "locked") {
      goToPhase(phaseId);
    }
  };

  const getStatus = (phaseId: PhaseId): PhaseStatus => {
    return phaseState.statuses[phaseId];
  };

  return {
    currentPhaseId: phaseState.currentPhaseId,
    currentConfig,
    currentIndex,
    totalPhases: configs.length,
    configs,
    canGoNext: canGoNext(),
    canGoPrev,
    goNext,
    goPrev,
    goTo,
    getStatus,
    completeAndNext,
  };
}
