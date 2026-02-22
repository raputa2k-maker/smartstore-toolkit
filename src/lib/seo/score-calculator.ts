import type { SeoScoreBreakdown } from "@/types/seo";
import type { ProductInfo } from "@/types/product";
import {
  FORBIDDEN_WORDS,
  PROMOTIONAL_PATTERNS,
  FORBIDDEN_CHAR_REGEX,
} from "./constants";

function scoreCharCount(name: string): number {
  const len = name.length;
  if (len >= 25 && len <= 50) return 25;
  if (len > 50 && len <= 60) return 20;
  if (len > 60 && len <= 80) return 10;
  if (len >= 15 && len < 25) return 20;
  return 0;
}

function scoreKeywordDuplication(name: string): number {
  const words = name
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map((w) => w.toLowerCase());

  const freq: Record<string, number> = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }

  const hasTriple = Object.values(freq).some((c) => c >= 3);
  if (hasTriple) return 0;

  const doubleCount = Object.values(freq).filter((c) => c === 2).length;
  return Math.max(0, 20 - doubleCount * 5);
}

function scoreForbiddenWords(name: string): number {
  const lower = name.toLowerCase();
  const count = FORBIDDEN_WORDS.filter((w) =>
    lower.includes(w.toLowerCase())
  ).length;
  return Math.max(0, 20 - count * 10);
}

function scoreSpecialChars(name: string): number {
  const matches = name.match(FORBIDDEN_CHAR_REGEX);
  if (!matches) return 10;
  return Math.max(0, 10 - matches.length * 5);
}

function scorePromotional(name: string): number {
  for (const pattern of PROMOTIONAL_PATTERNS) {
    if (pattern.test(name)) return 0;
  }
  return 10;
}

function scoreWritingOrder(name: string, info: ProductInfo): number {
  if (!info.brand && !info.productType) return 10;

  const parts = name.split(/\s+/);
  if (parts.length < 2) return 5;

  if (info.brand && info.productType) {
    const brandIdx = parts.findIndex((p) =>
      p.toLowerCase().includes(info.brand.toLowerCase())
    );
    const typeIdx = parts.findIndex((p) =>
      p.toLowerCase().includes(info.productType.toLowerCase())
    );
    if (brandIdx >= 0 && typeIdx >= 0 && brandIdx < typeIdx) return 10;
    if (brandIdx >= 0 && typeIdx >= 0) return 5;
  }

  return 7;
}

function scoreKeywordCount(name: string): number {
  const count = name.split(/\s+/).filter((w) => w.length > 0).length;
  if (count >= 4 && count <= 8) return 5;
  if (count === 3 || count === 9) return 3;
  return 0;
}

export function calculateSeoScore(
  name: string,
  info: ProductInfo
): SeoScoreBreakdown {
  const charCount = scoreCharCount(name);
  const keywordDup = scoreKeywordDuplication(name);
  const forbiddenWord = scoreForbiddenWords(name);
  const specialChar = scoreSpecialChars(name);
  const promotional = scorePromotional(name);
  const writingOrder = scoreWritingOrder(name, info);
  const keywordCount = scoreKeywordCount(name);

  return {
    charCount,
    keywordDup,
    forbiddenWord,
    specialChar,
    promotional,
    writingOrder,
    keywordCount,
    total:
      charCount +
      keywordDup +
      forbiddenWord +
      specialChar +
      promotional +
      writingOrder +
      keywordCount,
  };
}
