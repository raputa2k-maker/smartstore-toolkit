import { NextResponse } from "next/server";
import { createGeminiClient, MODEL_MAP } from "@/lib/gemini/client";
import type { ModelKey } from "@/lib/gemini/client";
import { buildDetailPrompt } from "@/lib/gemini/detail-prompt-builder";
import type { ProductInfo } from "@/types/product";
import type { DetailPageInput, GeneratedPlan, GeneratedSection } from "@/types/detail-page";

export const maxDuration = 60;

interface RequestBody {
  apiKey: string;
  model: ModelKey;
  productInfo: ProductInfo;
  confirmedName: string;
  seoScore: number;
  detailInput: DetailPageInput;
}

function extractJson(text: string): unknown {
  // Try direct JSON parse first
  try {
    return JSON.parse(text);
  } catch {
    // Continue to extraction
  }

  // Try extracting JSON from markdown code block
  const jsonBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonBlockMatch) {
    try {
      return JSON.parse(jsonBlockMatch[1].trim());
    } catch {
      // Continue
    }
  }

  // Try finding JSON object in the text
  const jsonObjMatch = text.match(/\{[\s\S]*"sections"[\s\S]*\}/);
  if (jsonObjMatch) {
    try {
      return JSON.parse(jsonObjMatch[0]);
    } catch {
      // Continue
    }
  }

  throw new Error("AI 응답에서 JSON을 추출할 수 없습니다.");
}

function buildFullMarkdown(sections: GeneratedSection[]): string {
  const lines: string[] = [
    "# 네이버 스마트스토어 상세페이지 기획안",
    "",
  ];

  for (const section of sections) {
    if (!section.enabled) continue;

    lines.push(`## ${section.title}`);
    lines.push("");
    lines.push(section.content);
    lines.push("");

    if (section.copywritingTips.length > 0) {
      lines.push("### 카피라이팅 팁");
      section.copywritingTips.forEach((tip) => {
        lines.push(`- ${tip}`);
      });
      lines.push("");
    }

    if (section.designNotes) {
      lines.push(`> **디자인 노트**: ${section.designNotes}`);
      lines.push("");
    }

    lines.push("---");
    lines.push("");
  }

  return lines.join("\n");
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { apiKey, model, productInfo, confirmedName, seoScore, detailInput } = body;

    // ─── 필수값 검증 ───
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API 키를 입력해주세요." },
        { status: 400 }
      );
    }

    if (!confirmedName) {
      return NextResponse.json(
        { success: false, error: "확정된 상품명이 필요합니다." },
        { status: 400 }
      );
    }

    // ─── Gemini 클라이언트 생성 ───
    const modelId = MODEL_MAP[model] || MODEL_MAP["gemini-2.5-flash"];
    const ai = createGeminiClient(apiKey);

    // ─── 프롬프트 생성 ───
    const { systemPrompt, userPrompt } = buildDetailPrompt({
      productInfo,
      confirmedName,
      seoScore,
      detailInput,
    });

    // ─── Gemini API 호출 ───
    const response = await ai.models.generateContent({
      model: modelId,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) {
      return NextResponse.json(
        { success: false, error: "AI 응답이 비어있습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    // ─── 응답 파싱 ───
    const parsed = extractJson(text) as Partial<GeneratedPlan>;

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      return NextResponse.json(
        { success: false, error: "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    // ─── fullMarkdown 생성 (AI가 제공하지 않았거나 비어있으면 직접 생성) ───
    const fullMarkdown = parsed.fullMarkdown?.trim()
      ? parsed.fullMarkdown
      : buildFullMarkdown(parsed.sections);

    const generatedPlan: GeneratedPlan = {
      sections: parsed.sections,
      ctaPlacements: parsed.ctaPlacements ?? [],
      seoNotes: parsed.seoNotes ?? "",
      mobileChecklist: parsed.mobileChecklist ?? [],
      estimatedScrollDepth: parsed.estimatedScrollDepth ?? "",
      industrySpecificNotes: parsed.industrySpecificNotes ?? [],
      fullMarkdown,
    };

    return NextResponse.json({
      success: true,
      data: generatedPlan,
    });
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };

    if (err.status === 401 || err.message?.includes("API key")) {
      return NextResponse.json(
        { success: false, error: "API 키가 유효하지 않습니다. 확인 후 다시 시도해주세요." },
        { status: 401 }
      );
    }

    if (err.status === 429) {
      return NextResponse.json(
        { success: false, error: "요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요." },
        { status: 429 }
      );
    }

    if (err.status === 503) {
      return NextResponse.json(
        { success: false, error: "AI 서버가 바쁩니다. 잠시 후 다시 시도해주세요." },
        { status: 503 }
      );
    }

    console.error("Generate detail error:", err.message || error);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "상세페이지 기획안 생성 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
