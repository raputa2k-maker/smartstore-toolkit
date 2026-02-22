import type { ValidationResult } from "@/types/seo";
import { AlertTriangle, XCircle } from "lucide-react";

interface ViolationAlertProps {
  violations: ValidationResult[];
}

export function ViolationAlert({ violations }: ViolationAlertProps) {
  if (violations.length === 0) return null;

  return (
    <div className="space-y-1.5 mt-2">
      {violations.map((v, idx) => (
        <div
          key={idx}
          className={`flex items-start gap-2 text-xs rounded-md px-2.5 py-1.5 ${
            v.severity === "error"
              ? "bg-red-50 text-red-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {v.severity === "error" ? (
            <XCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          )}
          <div>
            <span>{v.message}</span>
            {v.details && v.details.length > 0 && (
              <span className="ml-1 opacity-80">
                ({v.details.join(", ")})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
