import type { PhaseConfig } from "@/types/phase";

export const PHASE_CONFIGS: PhaseConfig[] = [
  {
    id: "settings",
    order: 0,
    title: "설정",
    description: "API 키 및 AI 모델 설정",
    icon: "Settings",
    isRequired: true,
    canSkip: false,
  },
  {
    id: "product-info",
    order: 1,
    title: "상품 정보",
    description: "상품 기본 정보 입력",
    icon: "Package",
    isRequired: true,
    canSkip: false,
  },
  {
    id: "seo-names",
    order: 2,
    title: "상품명 생성",
    description: "AI SEO 최적화 상품명 추천",
    icon: "Sparkles",
    isRequired: true,
    canSkip: false,
  },
  {
    id: "seo-check",
    order: 3,
    title: "SEO 검증",
    description: "선택한 상품명 가이드라인 검사",
    icon: "ShieldCheck",
    isRequired: true,
    canSkip: true,
  },
  {
    id: "detail-input",
    order: 4,
    title: "상세페이지 정보",
    description: "섹션별 상세페이지 정보 입력",
    icon: "FileText",
    isRequired: true,
    canSkip: false,
  },
  {
    id: "ai-generate",
    order: 5,
    title: "기획안 생성",
    description: "AI 상세페이지 기획안 자동 생성",
    icon: "Wand2",
    isRequired: true,
    canSkip: false,
  },
  {
    id: "preview",
    order: 6,
    title: "미리보기",
    description: "최종 기획안 확인 및 내보내기",
    icon: "Eye",
    isRequired: true,
    canSkip: false,
  },
];

export function getPhaseConfig(id: string): PhaseConfig | undefined {
  return PHASE_CONFIGS.find((c) => c.id === id);
}

export function getSortedConfigs(): PhaseConfig[] {
  return [...PHASE_CONFIGS].sort((a, b) => a.order - b.order);
}
