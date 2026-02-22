"use client";

import { createContext, useReducer, useCallback, type ReactNode } from "react";
import type { PhaseStore, PhaseState, PhaseAction, PhaseId } from "@/types/phase";
import {
  phaseStoreReducer,
  phaseStateReducer,
  initialPhaseStore,
  initialPhaseState,
  type PhaseStateAction,
} from "./phase-store";
import { getSortedConfigs } from "./phase-config";

// ─── Context Type ────────────────────────────────────────
interface PhaseContextType {
  store: PhaseStore;
  phaseState: PhaseState;
  dispatch: (action: PhaseAction) => void;
  dispatchPhase: (action: PhaseStateAction) => void;
  goToPhase: (id: PhaseId) => void;
  completeAndNext: (currentId: PhaseId) => void;
}

export const PhaseContext = createContext<PhaseContextType | null>(null);

// ─── Provider ────────────────────────────────────────────
export function PhaseProvider({ children }: { children: ReactNode }) {
  const [store, dispatch] = useReducer(phaseStoreReducer, initialPhaseStore);
  const [phaseState, dispatchPhase] = useReducer(phaseStateReducer, initialPhaseState);

  const goToPhase = useCallback((id: PhaseId) => {
    dispatchPhase({ type: "GO_TO_PHASE", payload: id });
  }, []);

  const completeAndNext = useCallback((currentId: PhaseId) => {
    dispatchPhase({ type: "COMPLETE_PHASE", payload: currentId });

    const sorted = getSortedConfigs();
    const idx = sorted.findIndex((c) => c.id === currentId);
    if (idx < sorted.length - 1) {
      const nextId = sorted[idx + 1].id;
      dispatchPhase({ type: "GO_TO_PHASE", payload: nextId });
    }
  }, []);

  return (
    <PhaseContext.Provider
      value={{ store, phaseState, dispatch, dispatchPhase, goToPhase, completeAndNext }}
    >
      {children}
    </PhaseContext.Provider>
  );
}
