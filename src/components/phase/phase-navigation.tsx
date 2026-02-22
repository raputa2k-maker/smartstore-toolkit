"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePhase } from "@/hooks/use-phase";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PhaseNavigationProps {
  onNext?: () => void;
  onPrev?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  showPrev?: boolean;
  showNext?: boolean;
}

export function PhaseNavigation({
  onNext,
  onPrev,
  nextLabel,
  nextDisabled = false,
  showPrev = true,
  showNext = true,
}: PhaseNavigationProps) {
  const { canGoPrev, goPrev, currentIndex, totalPhases } = usePhase();

  const handlePrev = onPrev ?? goPrev;
  const isLastPhase = currentIndex >= totalPhases - 1;

  return (
    <div className="flex items-center justify-between pt-6 border-t mt-6">
      {showPrev && canGoPrev ? (
        <Button variant="outline" onClick={handlePrev}>
          <ChevronLeft className="mr-1 h-4 w-4" />
          이전
        </Button>
      ) : (
        <div />
      )}

      {showNext && !isLastPhase && (
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
          <Button onClick={onNext} disabled={nextDisabled}>
            {nextLabel ?? "다음"}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
