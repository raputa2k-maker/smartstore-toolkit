import type { PhaseStore, PhaseState, PhaseAction, PhaseId, PhaseStatus } from "@/types/phase";
import type { ProductInfo } from "@/types/product";
import type { DetailPageInput } from "@/types/detail-page";
import { initialDetailPageInput } from "@/types/detail-page";
import { PHASE_CONFIGS } from "./phase-config";

// ─── Initial Phase Store ─────────────────────────────────
export const initialPhaseStore: PhaseStore = {
  settings: {
    apiKey: "",
    selectedModel: "gemini-2.5-flash",
    saveKey: false,
  },
  productInfo: {
    category: "",
    brand: "",
    series: "",
    productType: "",
    color: "",
    material: "",
    size: "",
    targetGender: "",
    additionalAttributes: "",
    keywords: [],
    isCustomOrder: false,
    customOrderDetails: { methods: [], optionTypes: [] },
  },
  seoResult: {
    recommendations: [],
    selectedIndex: null,
  },
  seoCheck: {
    confirmedName: "",
    score: 0,
    violations: [],
    isConfirmed: false,
  },
  detailInput: initialDetailPageInput,
  generated: null,
};

// ─── Initial Phase State ─────────────────────────────────
function buildInitialStatuses(): Record<PhaseId, PhaseStatus> {
  const statuses = {} as Record<PhaseId, PhaseStatus>;
  const sorted = [...PHASE_CONFIGS].sort((a, b) => a.order - b.order);
  sorted.forEach((config, idx) => {
    statuses[config.id] = idx === 0 ? "active" : "locked";
  });
  return statuses;
}

export const initialPhaseState: PhaseState = {
  currentPhaseId: "settings",
  statuses: buildInitialStatuses(),
};

// ─── Store Reducer ───────────────────────────────────────
export function phaseStoreReducer(state: PhaseStore, action: PhaseAction): PhaseStore {
  switch (action.type) {
    case "UPDATE_SETTINGS":
      return { ...state, settings: { ...state.settings, ...action.payload } };

    case "UPDATE_PRODUCT_INFO":
      return { ...state, productInfo: { ...state.productInfo, ...action.payload } as ProductInfo };

    case "SET_SEO_RESULTS":
      return { ...state, seoResult: { recommendations: action.payload, selectedIndex: null } };

    case "SELECT_RECOMMENDATION":
      return { ...state, seoResult: { ...state.seoResult, selectedIndex: action.payload } };

    case "UPDATE_SEO_CHECK":
      return { ...state, seoCheck: { ...state.seoCheck, ...action.payload } };

    case "UPDATE_DETAIL_SECTION": {
      const { section, data } = action.payload;
      return {
        ...state,
        detailInput: {
          ...state.detailInput,
          [section]: data,
        } as DetailPageInput,
      };
    }

    case "SET_GENERATED_PLAN":
      return { ...state, generated: action.payload };

    case "RESET_ALL":
      return initialPhaseStore;

    default:
      return state;
  }
}

// ─── Phase State Reducer ─────────────────────────────────
export type PhaseStateAction =
  | { type: "GO_TO_PHASE"; payload: PhaseId }
  | { type: "COMPLETE_PHASE"; payload: PhaseId }
  | { type: "RESET_PHASES" };

export function phaseStateReducer(state: PhaseState, action: PhaseStateAction): PhaseState {
  switch (action.type) {
    case "GO_TO_PHASE": {
      const newStatuses = { ...state.statuses };
      newStatuses[action.payload] = "active";
      return { ...state, currentPhaseId: action.payload, statuses: newStatuses };
    }

    case "COMPLETE_PHASE": {
      const newStatuses = { ...state.statuses };
      newStatuses[action.payload] = "completed";
      // Unlock the next phase
      const sorted = [...PHASE_CONFIGS].sort((a, b) => a.order - b.order);
      const currentIdx = sorted.findIndex((c) => c.id === action.payload);
      if (currentIdx < sorted.length - 1) {
        const nextId = sorted[currentIdx + 1].id;
        if (newStatuses[nextId] === "locked") {
          newStatuses[nextId] = "active";
        }
      }
      return { ...state, statuses: newStatuses };
    }

    case "RESET_PHASES":
      return initialPhaseState;

    default:
      return state;
  }
}
