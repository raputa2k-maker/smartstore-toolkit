"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { usePhaseStore } from "@/hooks/use-phase-store";

type SectionKey = "s0" | "s1" | "s2" | "s3" | "s4" | "s5" | "s6" | "s7" | "s8" | "s9";

interface SectionTabsProps {
  currentSection: SectionKey;
  onSectionChange: (section: SectionKey) => void;
}

const SECTION_LABELS: { key: SectionKey; label: string }[] = [
  { key: "s0", label: "프리헤더" },
  { key: "s1", label: "후킹" },
  { key: "s2", label: "베네핏" },
  { key: "s3", label: "사회적증거" },
  { key: "s4", label: "상세설명" },
  { key: "s5", label: "주문제작" },
  { key: "s6", label: "리뷰" },
  { key: "s7", label: "FAQ" },
  { key: "s8", label: "배송/환불" },
  { key: "s9", label: "브랜드" },
];

export function SectionTabs({ currentSection, onSectionChange }: SectionTabsProps) {
  const { store } = usePhaseStore();
  const isCustomOrder = store.productInfo.isCustomOrder;
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const tab = activeTabRef.current;
      const containerRect = container.getBoundingClientRect();
      const tabRect = tab.getBoundingClientRect();

      if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
        tab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [currentSection]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-1 overflow-x-auto pb-3 mb-4 scrollbar-none -mx-1 px-1"
    >
      {SECTION_LABELS.map(({ key, label }) => {
        const isDisabled = key === "s5" && !isCustomOrder;
        const isActive = currentSection === key;

        return (
          <button
            key={key}
            ref={isActive ? activeTabRef : undefined}
            type="button"
            disabled={isDisabled}
            onClick={() => onSectionChange(key)}
            className={cn(
              "relative shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
              isDisabled && "opacity-40 cursor-not-allowed hover:bg-muted hover:text-muted-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="section-tab-indicator"
                className="absolute inset-0 rounded-lg bg-primary"
                style={{ zIndex: -1 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
