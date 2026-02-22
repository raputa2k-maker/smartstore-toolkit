import type { ModelKey } from "@/lib/gemini/client";
import type { ProductInfo } from "./product";
import type { Recommendation } from "./result";
import type { ValidationResult } from "./seo";
import type { DetailPageInput, GeneratedPlan } from "./detail-page";

// ─── Phase IDs ───────────────────────────────────────────
export type PhaseId =
  | "settings"
  | "product-info"
  | "seo-names"
  | "seo-check"
  | "detail-input"
  | "ai-generate"
  | "preview";

export type PhaseStatus = "locked" | "active" | "completed";

// ─── Phase Config ────────────────────────────────────────
export interface PhaseConfig {
  id: PhaseId;
  order: number;
  title: string;
  description: string;
  icon: string;
  isRequired: boolean;
  canSkip: boolean;
}

// ─── Phase Navigation State ──────────────────────────────
export interface PhaseState {
  currentPhaseId: PhaseId;
  statuses: Record<PhaseId, PhaseStatus>;
}

// ─── Phase Store (All Phase Data) ────────────────────────
export interface PhaseStore {
  settings: {
    apiKey: string;
    selectedModel: ModelKey;
    saveKey: boolean;
  };
  productInfo: ProductInfo;
  seoResult: {
    recommendations: Recommendation[];
    selectedIndex: number | null;
  };
  seoCheck: {
    confirmedName: string;
    score: number;
    violations: ValidationResult[];
    isConfirmed: boolean;
  };
  detailInput: DetailPageInput;
  generated: GeneratedPlan | null;
}

// ─── Phase Actions ───────────────────────────────────────
export type PhaseAction =
  | { type: "SET_PHASE"; payload: PhaseId }
  | { type: "COMPLETE_PHASE"; payload: PhaseId }
  | { type: "UPDATE_SETTINGS"; payload: Partial<PhaseStore["settings"]> }
  | { type: "UPDATE_PRODUCT_INFO"; payload: Partial<ProductInfo> }
  | { type: "SET_SEO_RESULTS"; payload: Recommendation[] }
  | { type: "SELECT_RECOMMENDATION"; payload: number }
  | { type: "UPDATE_SEO_CHECK"; payload: Partial<PhaseStore["seoCheck"]> }
  | { type: "UPDATE_DETAIL_SECTION"; payload: { section: keyof DetailPageInput; data: unknown } }
  | { type: "SET_GENERATED_PLAN"; payload: GeneratedPlan }
  | { type: "RESET_ALL" };
