"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface PhaseTransitionProps {
  phaseKey: string;
  children: ReactNode;
}

export function PhaseTransition({ phaseKey, children }: PhaseTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phaseKey}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
