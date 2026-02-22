"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonPulseProps {
  lines?: number;
  className?: string;
}

export function SkeletonPulse({ lines = 3, className }: SkeletonPulseProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-4 rounded-md bg-muted"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
          style={{ width: `${85 - i * 10}%` }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn("rounded-xl border bg-card p-5 space-y-3", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <motion.div
          className="h-6 w-6 rounded-full bg-muted"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.div
          className="h-5 w-24 rounded bg-muted"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
        />
        <motion.div
          className="h-4 w-12 rounded bg-muted ml-auto"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
        />
      </div>
      <motion.div
        className="h-5 w-3/4 rounded bg-muted"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }}
      />
      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <motion.div
            key={n}
            className="h-5 w-14 rounded-full bg-muted"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: n * 0.1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}
