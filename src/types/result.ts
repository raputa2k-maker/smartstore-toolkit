import type { ValidationResult } from "./seo";

export interface Recommendation {
  name: string;
  reasoning: string;
  charCount: number;
  seoScore: number;
  keywords: string[];
  violations: ValidationResult[];
}

export interface GenerateResponse {
  success: boolean;
  data?: {
    recommendations: Recommendation[];
  };
  error?: string;
}
