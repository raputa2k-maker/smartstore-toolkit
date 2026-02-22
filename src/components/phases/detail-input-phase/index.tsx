"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { PhaseNavigation } from "@/components/phase/phase-navigation";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { usePhase } from "@/hooks/use-phase";
import { SectionTabs } from "./section-tabs";
import { S0PreheaderForm } from "./s0-preheader-form";
import { S1HookingForm } from "./s1-hooking-form";
import { S2BenefitsForm } from "./s2-benefits-form";
import { S3SocialProofForm } from "./s3-social-proof-form";
import { S4DetailForm } from "./s4-detail-form";
import { S5CustomOrderForm } from "./s5-custom-order-form";
import { S6ReviewsForm } from "./s6-reviews-form";
import { S7FaqForm } from "./s7-faq-form";
import { S8ShippingForm } from "./s8-shipping-form";
import { S9BrandForm } from "./s9-brand-form";

type SectionKey = "s0" | "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8" | "s9";

export function DetailInputPhase() {
  const [currentSection, setCurrentSection] = useState<SectionKey>("s0");
  const { store } = usePhaseStore();
  const { completeAndNext } = usePhase();

  const canProceed = store.detailInput.s1.mainCopy.trim().length > 0;

  const renderSection = () => {
    switch (currentSection) {
      case "s0":
        return <S0PreheaderForm />;
      case "s1":
        return <S1HookingForm />;
      case "s2":
        return <S2BenefitsForm />;
      case "s3":
        return <S3SocialProofForm />;
      case "s4":
        return <S4DetailForm />;
      case "s5":
        return <S5CustomOrderForm />;
      case "s6":
        return <S6ReviewsForm />;
      case "s7":
        return <S7FaqForm />;
      case "s8":
        return <S8ShippingForm />;
      case "s9":
        return <S9BrandForm />;
      default:
        return null;
    }
  };

  return (
    <div>
      <SectionTabs
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />

      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      <PhaseNavigation
        onNext={() => completeAndNext("detail-input")}
        nextDisabled={!canProceed}
        nextLabel="다음: AI 상세페이지 생성"
      />
    </div>
  );
}
