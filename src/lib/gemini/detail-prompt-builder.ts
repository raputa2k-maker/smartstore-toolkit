import type { ProductInfo } from "@/types/product";
import type { DetailPageInput } from "@/types/detail-page";

interface BuildDetailPromptParams {
  productInfo: ProductInfo;
  confirmedName: string;
  seoScore: number;
  detailInput: DetailPageInput;
}

const SYSTEM_PROMPT = `당신은 네이버 스마트스토어 상세페이지 기획 전문가입니다. 실제 매출을 올리는 상세페이지를 기획하는 10년차 베테랑으로, 모바일 퍼스트 원칙과 전환율 최적화에 정통합니다.

## 상세페이지 섹션 구조 (S0~S9)

각 섹션은 고객의 구매 여정을 따라 설계됩니다:

### S0: 프리 헤더
- 역할: 프로모션/할인/쿠폰 등 긴급성을 전달하는 최상단 배너
- 핵심: 짧고 강렬한 카피, 마감 기한 명시, 쿠폰 코드 노출
- 생략 가능 (enabled=false일 경우)

### S1: 후킹 섹션
- 역할: 스크롤을 멈추게 하는 첫 화면. 3초 안에 고객을 사로잡아야 함
- 핵심: 문제인식/결과제시/희소성/권위/스토리 중 하나의 후킹 전략 사용
- 히어로 이미지 + 메인 카피 + 서브 카피 구성

### S2: 핵심 베네핏
- 역할: "이 상품이 왜 좋은가"를 3~5가지로 명확히 전달
- 핵심: 특징(Feature)이 아닌 혜택(Benefit) 중심 서술
- 아이콘 + 헤드라인 + 설명 구성

### S3: 사회적 증거 1차
- 역할: 신뢰 구축. 판매량, 평점, 수상, 인증, 미디어 노출
- 핵심: 숫자와 구체적 데이터로 신뢰감 형성

### S4: 상품 상세 설명
- 역할: 소재, 사용법, 경쟁사 비교 등 깊은 정보 전달
- 핵심: 비교표, 사용 단계, 상세 이미지 설명

### S5: 주문제작 전용 (주문제작 상품에만 해당)
- 역할: 제작 과정, 커스텀 옵션, 수정 정책, 제작 기간 안내
- 핵심: 불확실성 해소, 투명한 프로세스 공개
- 주문제작 상품이 아니면 생략

### S6: 사회적 증거 2차 (리뷰)
- 역할: 실구매자 리뷰를 통한 신뢰 강화
- 핵심: 베스트 리뷰 하이라이트, 총 리뷰 수, 평균 평점

### S7: FAQ
- 역할: 구매 전 의문점 해소. 이탈 방지
- 핵심: 카테고리별 자주 묻는 질문과 답변

### S8: 배송/교환/환불
- 역할: 구매 안전장치. 불안 요소 제거
- 핵심: 명확한 정책 안내, 주문제작 상품 특수 사항

### S9: 브랜드 스토리
- 역할: 브랜드 철학과 마감 CTA
- 핵심: 감성적 마무리 + 강력한 행동 유도

## 핵심 설계 원칙

1. **모바일 퍼스트**: 모든 콘텐츠는 모바일 화면 기준(너비 860px)으로 설계
2. **문제인식 → 해결책 → 증거 → 불안해소 → 행동유도** 흐름 유지
3. **스크롤 깊이 최적화**: 핵심 정보를 상단에, 보조 정보를 하단에 배치
4. **CTA(구매하기) 버튼**: 주요 관심 지점 직후에 자연스럽게 배치
5. **가독성**: 짧은 문장, 적절한 여백, 시각적 계층 구조

## 출력 형식

반드시 아래 JSON 구조로 응답하세요:

{
  "sections": [
    {
      "sectionId": "s0",
      "enabled": true,
      "title": "섹션 제목",
      "content": "실제 사용 가능한 카피 및 구성 내용 (마크다운 형식)",
      "copywritingTips": ["카피라이팅 팁 1", "카피라이팅 팁 2"],
      "designNotes": "디자인 가이드 및 레이아웃 제안"
    }
  ],
  "ctaPlacements": [
    {
      "afterSection": "s2",
      "ctaText": "지금 구매하기",
      "ctaStyle": "primary-large"
    }
  ],
  "seoNotes": "상세페이지 SEO 관련 조언",
  "mobileChecklist": ["모바일 최적화 체크 항목 1", "모바일 최적화 체크 항목 2"],
  "estimatedScrollDepth": "예상 스크롤 깊이 설명",
  "industrySpecificNotes": ["업종별 특화 조언 1", "업종별 특화 조언 2"],
  "fullMarkdown": "전체 기획안을 마크다운 문서로 정리한 내용"
}

## 주문제작 상품 참고
주문제작 상품인 경우 S5 섹션을 반드시 생성하세요. 제작 과정의 투명성과 커스텀 옵션의 명확한 안내가 전환율에 직접적 영향을 줍니다.`;

function formatValue(value: unknown, fallback: string = "미입력 - AI가 추천해주세요"): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") return value.trim() || fallback;
  if (Array.isArray(value)) return value.length > 0 ? JSON.stringify(value, null, 2) : fallback;
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

export function buildDetailPrompt(params: BuildDetailPromptParams): {
  systemPrompt: string;
  userPrompt: string;
} {
  const { productInfo, confirmedName, seoScore, detailInput } = params;

  const systemPrompt = SYSTEM_PROMPT;

  // ─── 상품 기본 정보 ───
  const productParts: string[] = [
    `확정 상품명: ${confirmedName}`,
    `SEO 점수: ${seoScore}점`,
    "",
    "## 상품 기본 정보",
    `카테고리: ${formatValue(productInfo.category)}`,
    `브랜드: ${formatValue(productInfo.brand)}`,
    `시리즈/모델명: ${formatValue(productInfo.series)}`,
    `상품유형: ${formatValue(productInfo.productType)}`,
    `색상: ${formatValue(productInfo.color)}`,
    `소재: ${formatValue(productInfo.material)}`,
    `사이즈: ${formatValue(productInfo.size)}`,
    `타겟 성별: ${formatValue(productInfo.targetGender)}`,
    `추가 속성: ${formatValue(productInfo.additionalAttributes)}`,
    `핵심 키워드: ${productInfo.keywords?.length > 0 ? productInfo.keywords.join(", ") : "미입력 - AI가 추천해주세요"}`,
    `주문제작 여부: ${productInfo.isCustomOrder ? "예" : "아니오"}`,
  ];

  if (productInfo.isCustomOrder && productInfo.customOrderDetails) {
    const details = productInfo.customOrderDetails;
    productParts.push(`제작 방식: ${details.methods?.length > 0 ? details.methods.join(", ") : "미입력"}`);
    productParts.push(`커스텀 옵션: ${details.optionTypes?.length > 0 ? details.optionTypes.join(", ") : "미입력"}`);
  }

  // ─── 업종 타입 ───
  const industryLabels: Record<string, string> = {
    food: "식품",
    fashion: "패션/의류",
    beauty: "뷰티/화장품",
    furniture: "가구/인테리어",
    custom: "주문제작/핸드메이드",
    general: "일반",
  };
  productParts.push("");
  productParts.push(`## 업종 타입: ${industryLabels[detailInput?.industryType] || detailInput?.industryType || "일반"}`);

  // ─── 섹션별 입력 데이터 ───
  const sectionParts: string[] = ["", "## 섹션별 입력 데이터"];

  // S0: 프리 헤더
  sectionParts.push("");
  sectionParts.push("### S0: 프리 헤더");
  sectionParts.push(`활성화: ${detailInput.s0?.enabled ? "예" : "아니오"}`);
  if (detailInput.s0?.enabled) {
    sectionParts.push(`프로모션 문구: ${formatValue(detailInput.s0?.promotionText)}`);
    sectionParts.push(`할인율: ${formatValue(detailInput.s0?.discountRate)}`);
    sectionParts.push(`마감일: ${formatValue(detailInput.s0?.deadline)}`);
    sectionParts.push(`쿠폰 정보: ${formatValue(detailInput.s0?.couponInfo)}`);
  }

  // S1: 후킹 섹션
  sectionParts.push("");
  sectionParts.push("### S1: 후킹 섹션");
  const hookingLabels: Record<string, string> = {
    problem: "문제인식형", result: "결과제시형", scarcity: "희소성형",
    authority: "권위형", story: "스토리형",
  };
  sectionParts.push(`후킹 전략: ${hookingLabels[detailInput.s1?.hookingType] || detailInput.s1?.hookingType || "미입력"}`);
  sectionParts.push(`메인 카피: ${formatValue(detailInput.s1?.mainCopy)}`);
  sectionParts.push(`서브 카피: ${formatValue(detailInput.s1?.subCopy)}`);
  sectionParts.push(`히어로 이미지 설명: ${formatValue(detailInput.s1?.heroImageDescription)}`);

  // S2: 핵심 베네핏
  sectionParts.push("");
  sectionParts.push("### S2: 핵심 베네핏");
  if (detailInput.s2?.benefits?.length > 0 && detailInput.s2.benefits.some((b) => b.headline?.trim())) {
    detailInput.s2.benefits.forEach((b, i) => {
      sectionParts.push(`베네핏 ${i + 1}: ${formatValue(b.headline)} - ${formatValue(b.description)} (아이콘: ${formatValue(b.iconKeyword)})`);
    });
  } else {
    sectionParts.push("미입력 - AI가 추천해주세요");
  }

  // S3: 사회적 증거 1차
  sectionParts.push("");
  sectionParts.push("### S3: 사회적 증거 1차");
  sectionParts.push(`판매 수량: ${formatValue(detailInput.s3?.salesCount)}`);
  sectionParts.push(`평점: ${formatValue(detailInput.s3?.rating)}`);
  sectionParts.push(`랭킹 정보: ${formatValue(detailInput.s3?.rankingInfo)}`);
  sectionParts.push(`수상 내역: ${detailInput.s3?.awards?.length > 0 ? detailInput.s3.awards.join(", ") : "미입력 - AI가 추천해주세요"}`);
  sectionParts.push(`인증: ${detailInput.s3?.certifications?.length > 0 ? detailInput.s3.certifications.join(", ") : "미입력 - AI가 추천해주세요"}`);
  sectionParts.push(`미디어 노출: ${detailInput.s3?.mediaExposure?.length > 0 ? detailInput.s3.mediaExposure.join(", ") : "미입력 - AI가 추천해주세요"}`);

  // S4: 상품 상세 설명
  sectionParts.push("");
  sectionParts.push("### S4: 상품 상세 설명");
  sectionParts.push(`소재 설명: ${formatValue(detailInput.s4?.materialDescription)}`);
  sectionParts.push(`사용 단계: ${detailInput.s4?.usageSteps?.filter((s) => s.trim()).length > 0 ? detailInput.s4.usageSteps.filter((s) => s.trim()).join(" → ") : "미입력 - AI가 추천해주세요"}`);
  if (detailInput.s4?.comparisonPoints?.length > 0) {
    sectionParts.push("비교 포인트:");
    detailInput.s4.comparisonPoints.forEach((cp) => {
      sectionParts.push(`  - ${cp.attribute}: 우리 ${cp.ours} vs 타사 ${cp.theirs}`);
    });
  } else {
    sectionParts.push("비교 포인트: 미입력 - AI가 추천해주세요");
  }
  sectionParts.push(`상세 이미지 설명: ${formatValue(detailInput.s4?.detailImageDescription)}`);

  // S5: 주문제작 전용
  if (productInfo.isCustomOrder) {
    sectionParts.push("");
    sectionParts.push("### S5: 주문제작 전용 (이 상품은 주문제작 상품이므로 반드시 S5를 생성하세요)");
    if (detailInput.s5?.processSteps?.length > 0 && detailInput.s5.processSteps.some((s) => s.step?.trim())) {
      sectionParts.push("제작 과정:");
      detailInput.s5.processSteps.forEach((ps, i) => {
        sectionParts.push(`  ${i + 1}. ${formatValue(ps.step)} (${formatValue(ps.duration)}) - ${formatValue(ps.description)}`);
      });
    } else {
      sectionParts.push("제작 과정: 미입력 - AI가 추천해주세요");
    }
    if (detailInput.s5?.customOptions?.length > 0) {
      sectionParts.push("커스텀 옵션:");
      detailInput.s5.customOptions.forEach((opt) => {
        sectionParts.push(`  - ${formatValue(opt.type)}: ${opt.options?.join(", ") || "미입력"} (${formatValue(opt.note)})`);
      });
    } else {
      sectionParts.push("커스텀 옵션: 미입력 - AI가 추천해주세요");
    }
    const rp = detailInput.s5?.revisionPolicy;
    sectionParts.push(`수정 정책: 무료 수정 ${rp?.freeRevisions ?? "미입력"}회, 추가 비용 ${formatValue(rp?.extraCost)}, 범위 ${formatValue(rp?.scope)}, 기한 ${formatValue(rp?.deadline)}`);
    const pp = detailInput.s5?.productionPeriod;
    sectionParts.push(`제작 기간: 일반 ${formatValue(pp?.normalDays)}, 급행 ${formatValue(pp?.rushDays)} (추가비용 ${formatValue(pp?.rushExtraCost)}), 성수기 ${formatValue(pp?.peakSeasonNote)}`);
    sectionParts.push(`스토리텔링: ${formatValue(detailInput.s5?.storytelling)}`);
  }

  // S6: 리뷰
  sectionParts.push("");
  sectionParts.push("### S6: 사회적 증거 2차 (리뷰)");
  if (detailInput.s6?.highlightReviews?.length > 0) {
    sectionParts.push("하이라이트 리뷰:");
    detailInput.s6.highlightReviews.forEach((r) => {
      sectionParts.push(`  - ${r.reviewer} (${r.rating}점, ${formatValue(r.option)}): ${r.content}`);
    });
  } else {
    sectionParts.push("하이라이트 리뷰: 미입력 - AI가 추천해주세요");
  }
  sectionParts.push(`총 리뷰 수: ${formatValue(detailInput.s6?.totalReviewCount)}`);
  sectionParts.push(`평균 평점: ${formatValue(detailInput.s6?.averageRating)}`);

  // S7: FAQ
  sectionParts.push("");
  sectionParts.push("### S7: FAQ");
  if (detailInput.s7?.faqs?.length > 0 && detailInput.s7.faqs.some((f) => f.question?.trim())) {
    detailInput.s7.faqs.forEach((f) => {
      sectionParts.push(`  - [${formatValue(f.category)}] Q: ${formatValue(f.question)} A: ${formatValue(f.answer)}`);
    });
  } else {
    sectionParts.push("미입력 - AI가 업종에 맞는 FAQ를 추천해주세요");
  }

  // S8: 배송/교환/환불
  sectionParts.push("");
  sectionParts.push("### S8: 배송/교환/환불");
  sectionParts.push(`배송 소요일: ${formatValue(detailInput.s8?.deliveryDays)}`);
  sectionParts.push(`무료 배송 조건: ${formatValue(detailInput.s8?.freeShippingCondition)}`);
  sectionParts.push(`배송비: ${formatValue(detailInput.s8?.shippingCost)}`);
  sectionParts.push(`교환 정책: ${formatValue(detailInput.s8?.exchangePolicy)}`);
  sectionParts.push(`환불 정책: ${formatValue(detailInput.s8?.refundPolicy)}`);
  sectionParts.push(`하자 정책: ${formatValue(detailInput.s8?.defectPolicy)}`);
  if (productInfo.isCustomOrder) {
    sectionParts.push(`주문제작 반품 안내: ${formatValue(detailInput.s8?.customOrderReturnNote)}`);
  }

  // S9: 브랜드 스토리
  sectionParts.push("");
  sectionParts.push("### S9: 브랜드 스토리");
  sectionParts.push(`브랜드 미션: ${formatValue(detailInput.s9?.brandMission)}`);
  sectionParts.push(`브랜드 스토리: ${formatValue(detailInput.s9?.brandStory)}`);
  sectionParts.push(`클로징 카피: ${formatValue(detailInput.s9?.closingCopy)}`);
  sectionParts.push(`CTA 텍스트: ${formatValue(detailInput.s9?.ctaText)}`);

  // ─── 최종 사용자 프롬프트 조합 ───
  const userPrompt = `다음 상품 정보와 입력 데이터를 바탕으로 네이버 스마트스토어 상세페이지 기획안을 생성해주세요.

${productParts.join("\n")}

${sectionParts.join("\n")}

## 요청 사항
- 각 섹션별로 실제 사용 가능한 카피와 구성을 생성해주세요
- 비어있는 항목(미입력)은 상품 특성과 업종에 맞게 AI가 적절히 추천해주세요
- content 필드는 마크다운 형식으로, 실제 상세페이지에 바로 활용할 수 있는 수준으로 작성해주세요
- fullMarkdown 필드에는 전체 기획안을 하나의 마크다운 문서로 정리해주세요
- 모바일 환경(860px 기준)에 최적화된 구성을 제안해주세요`;

  return { systemPrompt, userPrompt };
}
