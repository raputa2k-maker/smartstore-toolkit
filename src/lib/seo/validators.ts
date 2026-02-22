import type { ValidationResult } from "@/types/seo";
import {
  FORBIDDEN_WORDS,
  PROMOTIONAL_PATTERNS,
  FORBIDDEN_CHAR_REGEX,
} from "./constants";

export function checkCharCount(name: string): ValidationResult {
  const len = name.length;
  if (len === 0) {
    return {
      type: "char_count",
      passed: false,
      message: "상품명을 입력해주세요.",
      severity: "error",
    };
  }
  if (len > 100) {
    return {
      type: "char_count",
      passed: false,
      message: `상품명이 ${len}자입니다. 최대 100자 이내로 작성해주세요.`,
      severity: "error",
    };
  }
  if (len > 50) {
    return {
      type: "char_count",
      passed: false,
      message: `상품명이 ${len}자입니다. 50자 이내를 권장합니다.`,
      severity: "warning",
    };
  }
  if (len < 10) {
    return {
      type: "char_count",
      passed: true,
      message: `상품명이 ${len}자입니다. 좀 더 상세한 정보를 추가해보세요.`,
      severity: "info",
    };
  }
  return {
    type: "char_count",
    passed: true,
    message: `상품명 ${len}자 - 적정 길이입니다.`,
    severity: "info",
  };
}

export function checkKeywordDuplication(name: string): ValidationResult {
  const words = name
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map((w) => w.toLowerCase());

  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  const duplicates = Object.entries(freq)
    .filter(([, count]) => count >= 3)
    .map(([word, count]) => `"${word}" (${count}회)`);

  if (duplicates.length > 0) {
    return {
      type: "keyword_dup",
      passed: false,
      message: "동일 키워드가 3회 이상 반복되었습니다.",
      severity: "error",
      details: duplicates,
    };
  }

  const minorDups = Object.entries(freq)
    .filter(([, count]) => count === 2)
    .map(([word]) => `"${word}"`);

  if (minorDups.length > 0) {
    return {
      type: "keyword_dup",
      passed: true,
      message: `키워드 2회 반복: ${minorDups.join(", ")}. 가능하면 줄여보세요.`,
      severity: "warning",
    };
  }

  return {
    type: "keyword_dup",
    passed: true,
    message: "키워드 중복 없음",
    severity: "info",
  };
}

export function checkForbiddenWords(name: string): ValidationResult {
  const lower = name.toLowerCase();
  const found = FORBIDDEN_WORDS.filter((word) =>
    lower.includes(word.toLowerCase())
  );

  if (found.length > 0) {
    return {
      type: "forbidden_word",
      passed: false,
      message: "금지어가 포함되어 있습니다.",
      severity: "error",
      details: found,
    };
  }

  return {
    type: "forbidden_word",
    passed: true,
    message: "금지어 없음",
    severity: "info",
  };
}

export function checkSpecialChars(name: string): ValidationResult {
  const matches = name.match(FORBIDDEN_CHAR_REGEX);

  if (matches && matches.length > 0) {
    const unique = [...new Set(matches)];
    return {
      type: "special_char",
      passed: false,
      message: "허용되지 않는 특수문자가 포함되어 있습니다.",
      severity: "error",
      details: unique.map((c) => `"${c}"`),
    };
  }

  return {
    type: "special_char",
    passed: true,
    message: "특수문자 사용 적정",
    severity: "info",
  };
}

export function checkPromotionalText(name: string): ValidationResult {
  const found: string[] = [];
  for (const pattern of PROMOTIONAL_PATTERNS) {
    const match = name.match(pattern);
    if (match) {
      found.push(match[0]);
    }
  }

  if (found.length > 0) {
    return {
      type: "promotional",
      passed: false,
      message: "홍보성/판매조건 문구가 포함되어 있습니다.",
      severity: "error",
      details: found,
    };
  }

  return {
    type: "promotional",
    passed: true,
    message: "홍보성 문구 없음",
    severity: "info",
  };
}

export function checkKeywordCount(name: string): ValidationResult {
  const words = name.split(/\s+/).filter((w) => w.length > 0);
  const count = words.length;

  if (count < 2) {
    return {
      type: "keyword_count",
      passed: false,
      message: `키워드 ${count}개 - 너무 적습니다. 4~8개를 권장합니다.`,
      severity: "warning",
    };
  }

  if (count > 10) {
    return {
      type: "keyword_count",
      passed: false,
      message: `키워드 ${count}개 - 너무 많습니다. 4~8개를 권장합니다.`,
      severity: "warning",
    };
  }

  if (count >= 4 && count <= 8) {
    return {
      type: "keyword_count",
      passed: true,
      message: `키워드 ${count}개 - 적정 범위입니다.`,
      severity: "info",
    };
  }

  return {
    type: "keyword_count",
    passed: true,
    message: `키워드 ${count}개`,
    severity: "info",
  };
}

export function validateProductName(name: string): ValidationResult[] {
  return [
    checkCharCount(name),
    checkKeywordDuplication(name),
    checkForbiddenWords(name),
    checkSpecialChars(name),
    checkPromotionalText(name),
    checkKeywordCount(name),
  ];
}
