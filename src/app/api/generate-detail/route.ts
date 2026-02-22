import { NextResponse } from "next/server";
import { callGemini, MODEL_MAP } from "@/lib/gemini/client";
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

function cleanJsonString(raw: string): string {
  let s = raw.replace(/^\uFEFF/, "").trim();
  s = s.replace(/,\s*([\]}])/g, "$1");
  return s;
}

/**
 * 잘린(truncated) JSON 문자열을 복구하는 함수
 * 열린 브래킷/브레이스를 닫아서 파싱 가능하게 만듦
 */
function repairTruncatedJson(text: string): string {
  let s = text.trim();

  // 문자열 내부에서 잘렸으면 문자열 닫기
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
    }
  }
  if (inString) {
    s += '"';
  }

  // 마지막 불완전한 key-value 쌍 제거 (예: ,"key": 또는 ,"key": "val 등)
  // 먼저 trailing comma 제거
  s = s.replace(/,\s*$/, "");

  // 열린 브래킷/브레이스 닫기
  const stack: string[] = [];
  inString = false;
  escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") stack.push("}");
    else if (ch === "[") stack.push("]");
    else if (ch === "}" || ch === "]") stack.pop();
  }

  // 역순으로 닫기
  while (stack.length > 0) {
    s += stack.pop();
  }

  return s;
}

function extractJson(text: string): unknown {
  const cleaned = cleanJsonString(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    // continue
  }

  const codeBlockMatch = cleaned.match(/```(?:json)?\s*\n?([\s\S]+?)\n?\s*```/);
  if (codeBlockMatch) {
    try {
      return JSON.parse(cleanJsonString(codeBlockMatch[1]));
    } catch {
      // continue
    }
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    const candidate = cleaned.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(cleanJsonString(candidate));
    } catch {
      // continue
    }
  }

  const jsonObjMatch = cleaned.match(/\{[\s\S]*"sections"[\s\S]*\}/);
  if (jsonObjMatch) {
    try {
      return JSON.parse(cleanJsonString(jsonObjMatch[0]));
    } catch {
      // continue
    }
  }

  // 잘린 JSON 복구 시도
  if (cleaned.trimStart().startsWith("{")) {
    try {
      const repaired = repairTruncatedJson(cleaned);
      return JSON.parse(repaired);
    } catch {
      // continue
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

    const modelId = MODEL_MAP[model] || MODEL_MAP["gemini-2.5-flash"];

    const { systemPrompt, userPrompt } = buildDetailPrompt({
      productInfo,
      confirmedName,
      seoScore,
      detailInput,
    });

    const response = await callGemini({
      apiKey,
      model: modelId,
      systemPrompt,
      userPrompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 65536,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (response.finishReason === "MAX_TOKENS") {
      console.warn("Warning: Gemini response was truncated (MAX_TOKENS). Length:", text?.length);
    }

    if (!text) {
      return NextResponse.json(
        { success: false, error: "AI 응답이 비어있습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    let parsed: Partial<GeneratedPlan>;
    try {
      parsed = extractJson(text) as Partial<GeneratedPlan>;
    } catch {
      console.error("JSON extraction failed. Response length:", text.length);
      return NextResponse.json(
        { success: false, error: "AI 응답에서 JSON을 추출할 수 없습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    if (!parsed.sections || !Array.isArray(parsed.sections)) {
      return NextResponse.json(
        { success: false, error: "AI 응답 형식이 올바르지 않습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

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

    console.error("Generate detail error:", err.message || error);
    return NextResponse.json(
      {
        success: false,
        error: err.message || "상세페이지 기획안 생성 중 오류가 발생했습니다.",
      },
      { status: (err.status && err.status >= 400) ? err.status : 500 }
    );
  }
}
