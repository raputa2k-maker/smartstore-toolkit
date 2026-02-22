export const GENDER_OPTIONS = [
  { value: "", label: "선택 안함" },
  { value: "male", label: "남성" },
  { value: "female", label: "여성" },
  { value: "unisex", label: "남녀공용" },
  { value: "kids", label: "아동" },
  { value: "baby", label: "유아" },
] as const;

export const CUSTOM_ORDER_METHODS = [
  "각인",
  "레터링",
  "핸드메이드",
  "맞춤 사이즈",
  "수제",
  "커스텀 프린팅",
  "자수",
] as const;

export const CUSTOM_OPTION_TYPES = [
  "이니셜",
  "문구",
  "크기",
  "디자인",
  "색상 선택",
  "소재 선택",
  "각인 문구",
] as const;

export const FORBIDDEN_WORDS: string[] = [
  // 할인/판매조건
  "주문폭주", "즉시할인", "재입고", "한정판매", "첫구매", "공짜",
  "이벤트", "쿠폰", "적립", "초특가", "핫딜", "오늘만",
  "긴급", "마감임박", "땡처리", "떨이",
  // 가격 관련
  "최저가", "할인", "세일", "특가", "파격", "가격인하",
  // 배송/구매 조건
  "무료배송", "당일배송", "사은품", "증정", "서비스",
  // 과장 수식어
  "인기", "추천", "베스트", "대박", "히트", "품절대란",
  "MD추천", "가성비", "최고", "최저", "저렴",
  // 구매 유도
  "선착순", "임박", "품절", "문의", "구매불가", "상담",
  "긴급모객", "1위", "신상품", "정품",
  // 영문 홍보
  "TOP", "BEST", "HOT", "NEW", "SALE", "FREE",
];

export const PROMOTIONAL_PATTERNS: RegExp[] = [
  /\d+%\s*(할인|off|세일)/i,
  /\d+원/,
  /\d+\+\d+/,
  /무료\s*배송/,
  /사은품\s*증정/,
  /리뷰.*이벤트/,
  /구매\s*시/,
  /오늘\s*만/,
  /한정\s*수량/,
];

export const ALLOWED_SPECIAL_CHARS = [
  "(", ")", "-", ".", "[", "]", "/", "&", "+", ",", "~",
];

export const FORBIDDEN_CHAR_REGEX =
  /[^\uAC00-\uD7AF\u1100-\u11FFa-zA-Z0-9\s()\-.\[\]\/&+,~]/g;
