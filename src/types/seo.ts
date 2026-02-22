export type ValidationType =
  | "char_count"
  | "keyword_dup"
  | "forbidden_word"
  | "special_char"
  | "promotional"
  | "keyword_count";

export type Severity = "error" | "warning" | "info";

export interface ValidationResult {
  type: ValidationType;
  passed: boolean;
  message: string;
  severity: Severity;
  details?: string[];
}

export interface SeoScoreBreakdown {
  charCount: number;
  keywordDup: number;
  forbiddenWord: number;
  specialChar: number;
  promotional: number;
  writingOrder: number;
  keywordCount: number;
  total: number;
}
