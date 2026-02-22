import { NextResponse } from "next/server";
import { callGemini, MODEL_MAP } from "@/lib/gemini/client";
import type { ModelKey } from "@/lib/gemini/client";
import { buildPrompt } from "@/lib/gemini/prompt-builder";
import { parseGeminiResponse } from "@/lib/gemini/response-parser";
import { calculateSeoScore } from "@/lib/seo/score-calculator";
import { validateProductName } from "@/lib/seo/validators";
import type { ProductInfo } from "@/types/product";

export const maxDuration = 30;

interface RequestBody {
  apiKey: string;
  model: ModelKey;
  productInfo: ProductInfo;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { apiKey, model, productInfo } = body;

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API 키를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!productInfo.productType) {
      return NextResponse.json(
        { success: false, error: "상품유형은 필수 입력 항목입니다." },
        { status: 400 }
      );
    }

    const modelId = MODEL_MAP[model] || MODEL_MAP["gemini-2.5-flash"];
    const { systemPrompt, userPrompt } = buildPrompt(productInfo);

    const response = await callGemini({
      apiKey,
      model: modelId,
      systemPrompt,
      userPrompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    const parsed = parseGeminiResponse(text);

    const recommendations = parsed.recommendations.map((rec) => {
      const scoreBreakdown = calculateSeoScore(rec.name, productInfo);
      const violations = validateProductName(rec.name).filter((v) => !v.passed);
      const matchedKeywords = (productInfo.keywords ?? []).filter((kw) =>
        rec.name.toLowerCase().includes(kw.toLowerCase())
      );

      return {
        name: rec.name,
        reasoning: rec.reasoning,
        charCount: rec.name.length,
        seoScore: scoreBreakdown.total,
        keywords: matchedKeywords,
        violations,
      };
    });

    return NextResponse.json({
      success: true,
      data: { recommendations },
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };

    console.error("Generate error:", err.message || error);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "상품명 생성 중 오류가 발생했습니다.",
      },
      { status: (err.status && err.status >= 400) ? err.status : 500 }
    );
  }
}
