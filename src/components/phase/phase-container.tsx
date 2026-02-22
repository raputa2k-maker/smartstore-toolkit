"use client";

import { usePhase } from "@/hooks/use-phase";
import { PhaseTransition } from "@/components/motion/phase-transition";
import type { PhaseId } from "@/types/phase";
import type { ComponentType } from "react";

// Lazy imports for each phase component
import { SettingsPhase } from "@/components/phases/settings-phase";
import { ProductInfoPhase } from "@/components/phases/product-info-phase";
import { SeoNamesPhase } from "@/components/phases/seo-names-phase";
import { SeoCheckPhase } from "@/components/phases/seo-check-phase";
import { DetailInputPhase } from "@/components/phases/detail-input-phase";
import { AiGeneratePhase } from "@/components/phases/ai-generate-phase";
import { PreviewPhase } from "@/components/phases/preview-phase";

const PHASE_COMPONENTS: Record<PhaseId, ComponentType> = {
  settings: SettingsPhase,
  "product-info": ProductInfoPhase,
  "seo-names": SeoNamesPhase,
  "seo-check": SeoCheckPhase,
  "detail-input": DetailInputPhase,
  "ai-generate": AiGeneratePhase,
  preview: PreviewPhase,
};

export function PhaseContainer() {
  const { currentPhaseId, currentConfig } = usePhase();
  const Component = PHASE_COMPONENTS[currentPhaseId];

  if (!Component || !currentConfig) {
    return <div className="text-center text-muted-foreground py-12">페이즈를 찾을 수 없습니다.</div>;
  }

  return (
    <PhaseTransition phaseKey={currentPhaseId}>
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">{currentConfig.title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{currentConfig.description}</p>
        </div>
        <Component />
      </div>
    </PhaseTransition>
  );
}
