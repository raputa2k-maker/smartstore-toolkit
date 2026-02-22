"use client";

import { motion } from "framer-motion";
import { usePhase } from "@/hooks/use-phase";
import { cn } from "@/lib/utils";
import {
  Settings,
  Package,
  Sparkles,
  ShieldCheck,
  FileText,
  Wand2,
  Eye,
  Check,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Settings,
  Package,
  Sparkles,
  ShieldCheck,
  FileText,
  Wand2,
  Eye,
};

export function PhaseProgress() {
  const { configs, currentPhaseId, getStatus, goTo } = usePhase();

  return (
    <div className="w-full">
      {/* Desktop — Grid로 균등 배치, 라인은 absolute로 원 중심 정렬 */}
      <div
        className="hidden md:grid"
        style={{ gridTemplateColumns: `repeat(${configs.length}, 1fr)` }}
      >
        {configs.map((config, idx) => {
          const status = getStatus(config.id);
          const isCurrent = config.id === currentPhaseId;
          const Icon = ICON_MAP[config.icon] ?? Settings;

          return (
            <div key={config.id} className="relative flex flex-col items-center">
              <button
                onClick={() => goTo(config.id)}
                disabled={status === "locked"}
                className={cn(
                  "flex flex-col items-center gap-1.5 group transition-all",
                  status === "locked" ? "cursor-not-allowed opacity-40" : "cursor-pointer"
                )}
              >
                <motion.div
                  whileHover={status !== "locked" ? { scale: 1.08 } : undefined}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all",
                    isCurrent && "border-primary bg-primary text-primary-foreground shadow-md",
                    status === "completed" && !isCurrent && "border-primary bg-primary/10 text-primary",
                    status === "locked" && "border-muted-foreground/30 text-muted-foreground/30",
                    status === "active" && !isCurrent && "border-muted-foreground/50 text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {status === "completed" && !isCurrent ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Icon className="h-4 w-4" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "text-xs font-medium whitespace-nowrap",
                    isCurrent && "text-primary",
                    status === "completed" && !isCurrent && "text-primary/80",
                    status === "locked" && "text-muted-foreground/40",
                    status === "active" && !isCurrent && "text-muted-foreground"
                  )}
                >
                  {config.title}
                </span>
              </button>

              {/* 연결 라인: 현재 원의 오른쪽 끝 → 다음 원의 왼쪽 끝 */}
              {idx < configs.length - 1 && (
                <div
                  className="absolute h-0.5"
                  style={{ top: 17, left: "calc(50% + 18px)", right: "calc(-50% + 18px)" }}
                >
                  <div className={cn("absolute inset-0", status === "completed" ? "bg-primary/40" : "bg-border")} />
                  <motion.div
                    className="absolute inset-0 bg-primary/40 h-full origin-left"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: status === "completed" ? 1 : 0 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">
            {configs.findIndex((c) => c.id === currentPhaseId) + 1}/{configs.length} 단계
          </span>
          <span className="text-sm text-muted-foreground">
            {configs.find((c) => c.id === currentPhaseId)?.title}
          </span>
        </div>
        <div className="flex gap-1">
          {configs.map((config) => {
            const status = getStatus(config.id);
            const isCurrent = config.id === currentPhaseId;
            return (
              <motion.div
                layout
                key={config.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all",
                  isCurrent && "bg-primary",
                  status === "completed" && "bg-primary/60",
                  status === "locked" && "bg-muted",
                  status === "active" && !isCurrent && "bg-muted-foreground/20"
                )}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
