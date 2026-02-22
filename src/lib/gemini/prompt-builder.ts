import type { ProductInfo } from "@/types/product";
import { CATEGORIES } from "@/lib/seo/constants";

const SYSTEM_PROMPT = `당신은 네이버 스마트스토어 SEO 전문가입니다. 사용자가 제공하는 상품 정보를 바탕으로 네이버 쇼핑 검색에 최적화된 상품명을 생성해주세요.

## 표준상품명 9대 규칙 (반드시 준수)

1. 50자 내외 텍스트로 작성 (최대 100자, 25~50자 권장)
2. 조사(은, 는, 이, 가, 을, 를), 수식어 사용하지 않음
3. 셀러명, 쇼핑몰명, 상호명을 상품명에 포함하지 않음
4. 한글 기본, 필요 시 영문 사용. 숫자는 아라비아 숫자. 한글/영문 외 다른 언어 사용 금지
5. 허용 특수문자: ( ) - . [ ] / & + , ~ 만 사용. 최소한으로 사용
6. 이벤트, 판매조건, 할인가격, 쿠폰, 적립, 배송정보 등 기입하지 않음
7. 하나의 상품에 대한 단일 정보만 기입
8. 키워드 4~8개 범위로 구성
9. 키워드 중복 사용 금지 (동일 단어 2회 이하, 3회 이상 반복 절대 금지)

## 작성 순서 (이 순서를 지켜주세요)
브랜드/제조사 > 시리즈/모델명 > 상품유형(형태) > 색상 > 소재 > 수량 > 사이즈 > 성별/나이 > 속성

## 금지어 목록 (절대 포함하지 마세요)
무료배송, 할인, 세일, 특가, 최저가, 1+1, 사은품, 파격, 이벤트, 쿠폰, 적립, 인기, 추천, 베스트, 대박, 히트, MD추천, 가성비, 최고, 최저, 저렴, 선착순, 임박, 품절, 신상품, 정품, TOP, BEST, HOT, NEW, SALE, FREE, 주문폭주, 즉시할인, 초특가, 핫딜, 오늘만, 긴급, 마감임박, 땡처리

## 출력 규칙
- 정확히 5개의 상품명을 생성하세요
- 각 상품명은 25~50자 사이로 작성하세요
- 각 상품명마다 왜 이렇게 작성했는지 간단히 설명하세요
- 반드시 아래 JSON 형식으로만 응답하세요

{
  "recommendations": [
    { "name": "상품명 예시", "reasoning": "이유 설명" }
  ]
}`;

const CUSTOM_ORDER_RULES = `
## 주문제작 상품 추가 규칙 (이 상품은 주문제작 상품입니다)
- "주문제작", "맞춤제작", "커스텀" 중 하나만 상품명 앞쪽에 포함하세요 (동의어 중복 사용 금지)
- 제작 방식(각인, 레터링, 핸드메이드 등)을 구체적으로 명시하세요
- 커스텀 옵션 유형(이니셜, 문구 등)을 자연스럽게 포함하세요
- 공방명/셀러명은 절대 포함하지 마세요`;

export function buildPrompt(productInfo: ProductInfo): {
  systemPrompt: string;
  userPrompt: string;
} {
  let systemPrompt = SYSTEM_PROMPT;

  if (productInfo.isCustomOrder) {
    systemPrompt += "\n" + CUSTOM_ORDER_RULES;
  }

  const parts: string[] = [];

  const categoryLabel =
    CATEGORIES.find((c) => c.value === productInfo.category)?.label || "";
  if (categoryLabel) parts.push(`카테고리: ${categoryLabel}`);
  if (productInfo.brand) parts.push(`브랜드: ${productInfo.brand}`);
  if (productInfo.series) parts.push(`시리즈/모델명: ${productInfo.series}`);
  if (productInfo.productType)
    parts.push(`상품유형: ${productInfo.productType}`);
  if (productInfo.color) parts.push(`색상: ${productInfo.color}`);
  if (productInfo.material) parts.push(`소재: ${productInfo.material}`);
  if (productInfo.size) parts.push(`사이즈/규격: ${productInfo.size}`);
  if (productInfo.targetGender)
    parts.push(`타겟: ${productInfo.targetGender}`);
  if (productInfo.additionalAttributes)
    parts.push(`추가 속성: ${productInfo.additionalAttributes}`);
  if (productInfo.keywords.length > 0)
    parts.push(`핵심 키워드: ${productInfo.keywords.join(", ")}`);

  if (productInfo.isCustomOrder) {
    const details = productInfo.customOrderDetails;
    if (details.methods.length > 0)
      parts.push(`제작 방식: ${details.methods.join(", ")}`);
    if (details.optionTypes.length > 0)
      parts.push(`커스텀 옵션: ${details.optionTypes.join(", ")}`);
  }

  const userPrompt = `다음 상품 정보를 바탕으로 최적화된 상품명 5개를 생성해주세요.\n\n${parts.join("\n")}`;

  return { systemPrompt, userPrompt };
}
