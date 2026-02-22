"use client";

import type { ValidationResult } from "@/types/seo";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface CheckResultProps {
  results: ValidationResult[];
}

const TYPE_LABELS: Record<string, string> = {
  char_count: "글자 수",
  keyword_dup: "키워드 중복",
  forbidden_word: "금지어",
  special_char: "특수문자",
  promotional: "홍보성 문구",
  keyword_count: "키워드 개수",
};

export function CheckResult({ results }: CheckResultProps) {
  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium">
        <span>
          검사 결과: {passedCount}/{totalCount} 통과
        </span>
        {passedCount === totalCount && (
          <span className="text-emerald-600">- 모든 항목 통과</span>
        )}
      </div>

      <div className="space-y-2">
        {results.map((result, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: idx * 0.06, ease: "easeOut" }}
            className={`flex items-start gap-2.5 rounded-md px-3 py-2.5 text-sm ${
              result.passed
                ? result.severity === "warning"
                  ? "bg-amber-50"
                  : "bg-emerald-50"
                : result.severity === "error"
                  ? "bg-red-50"
                  : "bg-amber-50"
            }`}
          >
            {result.passed ? (
              result.severity === "warning" ? (
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              )
            ) : result.severity === "error" ? (
              <XCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-medium">
                [{TYPE_LABELS[result.type] || result.type}]
              </span>{" "}
              <span
                className={
                  result.passed
                    ? result.severity === "warning"
                      ? "text-amber-700"
                      : "text-emerald-700"
                    : result.severity === "error"
                      ? "text-red-700"
                      : "text-amber-700"
                }
              >
                {result.message}
              </span>
              {result.details && result.details.length > 0 && (
                <div className="text-xs mt-0.5 opacity-80">
                  {result.details.join(", ")}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
