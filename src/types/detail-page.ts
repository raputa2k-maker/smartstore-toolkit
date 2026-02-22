// ─── S0: 프리 헤더 ───────────────────────────────────────
export interface PreheaderInput {
  enabled: boolean;
  promotionText: string;
  discountRate: string;
  deadline: string;
  couponInfo: string;
}

// ─── S1: 후킹 섹션 ──────────────────────────────────────
export type HookingType = "problem" | "result" | "scarcity" | "authority" | "story";

export interface HookingInput {
  hookingType: HookingType;
  mainCopy: string;
  subCopy: string;
  heroImageDescription: string;
}

// ─── S2: 핵심 베네핏 ─────────────────────────────────────
export interface BenefitItem {
  headline: string;
  description: string;
  iconKeyword: string;
}

export interface BenefitsInput {
  benefits: BenefitItem[];
}

// ─── S3: 사회적 증거 1차 ─────────────────────────────────
export interface SocialProof1Input {
  salesCount: string;
  rating: string;
  rankingInfo: string;
  awards: string[];
  certifications: string[];
  mediaExposure: string[];
}

// ─── S4: 상품 상세 설명 ──────────────────────────────────
export interface ComparisonRow {
  attribute: string;
  ours: string;
  theirs: string;
}

export interface ProductDetailInput {
  materialDescription: string;
  usageSteps: string[];
  comparisonPoints: ComparisonRow[];
  detailImageDescription: string;
}

// ─── S5: 주문제작 전용 ───────────────────────────────────
export interface ProcessStep {
  step: string;
  duration: string;
  description: string;
}

export interface CustomOption {
  type: string;
  options: string[];
  note: string;
}

export interface RevisionPolicy {
  freeRevisions: number;
  extraCost: string;
  scope: string;
  deadline: string;
}

export interface ProductionPeriod {
  normalDays: string;
  rushDays: string;
  rushExtraCost: string;
  peakSeasonNote: string;
}

export interface CustomOrderInput {
  processSteps: ProcessStep[];
  customOptions: CustomOption[];
  revisionPolicy: RevisionPolicy;
  productionPeriod: ProductionPeriod;
  storytelling: string;
}

// ─── S6: 사회적 증거 2차 (리뷰) ──────────────────────────
export interface ReviewItem {
  reviewer: string;
  rating: number;
  content: string;
  option: string;
}

export interface ReviewsInput {
  highlightReviews: ReviewItem[];
  totalReviewCount: string;
  averageRating: string;
}

// ─── S7: FAQ ─────────────────────────────────────────────
export interface FaqItem {
  category: string;
  question: string;
  answer: string;
}

export interface FaqInput {
  faqs: FaqItem[];
}

// ─── S8: 배송/교환/환불 ──────────────────────────────────
export interface ShippingInput {
  deliveryDays: string;
  freeShippingCondition: string;
  shippingCost: string;
  exchangePolicy: string;
  refundPolicy: string;
  defectPolicy: string;
  customOrderReturnNote: string;
}

// ─── S9: 브랜드 스토리 ───────────────────────────────────
export interface BrandStoryInput {
  brandMission: string;
  brandStory: string;
  closingCopy: string;
  ctaText: string;
}

// ─── 전체 입력 통합 ──────────────────────────────────────
export type IndustryType = "food" | "fashion" | "beauty" | "furniture" | "custom" | "general";

export interface DetailPageInput {
  s0: PreheaderInput;
  s1: HookingInput;
  s2: BenefitsInput;
  s3: SocialProof1Input;
  s4: ProductDetailInput;
  s5: CustomOrderInput;
  s6: ReviewsInput;
  s7: FaqInput;
  s8: ShippingInput;
  s9: BrandStoryInput;
  industryType: IndustryType;
}

// ─── AI 생성 결과 ────────────────────────────────────────
export interface GeneratedSection {
  sectionId: string;
  enabled: boolean;
  title: string;
  content: string;
  copywritingTips: string[];
  designNotes: string;
}

export interface CtaPlacement {
  afterSection: string;
  ctaText: string;
  ctaStyle: string;
}

export interface GeneratedPlan {
  sections: GeneratedSection[];
  ctaPlacements: CtaPlacement[];
  seoNotes: string;
  mobileChecklist: string[];
  estimatedScrollDepth: string;
  industrySpecificNotes: string[];
  fullMarkdown: string;
}

// ─── 초기값 ──────────────────────────────────────────────
export const initialDetailPageInput: DetailPageInput = {
  s0: { enabled: false, promotionText: "", discountRate: "", deadline: "", couponInfo: "" },
  s1: { hookingType: "problem", mainCopy: "", subCopy: "", heroImageDescription: "" },
  s2: { benefits: [{ headline: "", description: "", iconKeyword: "" }] },
  s3: { salesCount: "", rating: "", rankingInfo: "", awards: [], certifications: [], mediaExposure: [] },
  s4: { materialDescription: "", usageSteps: [""], comparisonPoints: [], detailImageDescription: "" },
  s5: {
    processSteps: [{ step: "", duration: "", description: "" }],
    customOptions: [],
    revisionPolicy: { freeRevisions: 2, extraCost: "", scope: "", deadline: "48" },
    productionPeriod: { normalDays: "", rushDays: "", rushExtraCost: "", peakSeasonNote: "" },
    storytelling: "",
  },
  s6: { highlightReviews: [], totalReviewCount: "", averageRating: "" },
  s7: { faqs: [{ category: "", question: "", answer: "" }] },
  s8: { deliveryDays: "", freeShippingCondition: "", shippingCost: "", exchangePolicy: "", refundPolicy: "", defectPolicy: "", customOrderReturnNote: "" },
  s9: { brandMission: "", brandStory: "", closingCopy: "", ctaText: "구매하기" },
  industryType: "general",
};
