import { GoogleGenAI } from "@google/genai";

export const MODEL_MAP = {
  "gemini-2.5-flash-lite": "gemini-2.5-flash-lite",
  "gemini-2.5-flash": "gemini-2.5-flash",
  "gemini-3-flash-preview": "gemini-3-flash-preview",
  "gemini-3.1-pro-preview": "gemini-3.1-pro-preview",
} as const;

export type ModelKey = keyof typeof MODEL_MAP;

// ─── 모델 메타 정보 (UI 표시용) ──────────────────────
export interface ModelInfo {
  label: string;
  description: string;
  tier: "budget" | "balanced" | "premium";
  badge?: string;
  recommendedFor?: string;
}

export const MODEL_INFO: Record<ModelKey, ModelInfo> = {
  "gemini-2.5-flash-lite": {
    label: "Gemini 2.5 Flash-Lite",
    description: "가장 빠르고 저렴한 모델",
    tier: "budget",
    recommendedFor: "상품명 생성",
  },
  "gemini-2.5-flash": {
    label: "Gemini 2.5 Flash",
    description: "안정적인 범용 모델",
    tier: "balanced",
  },
  "gemini-3-flash-preview": {
    label: "Gemini 3 Flash",
    description: "차세대 Flash 모델 (프리뷰)",
    tier: "balanced",
    badge: "NEW",
  },
  "gemini-3.1-pro-preview": {
    label: "Gemini 3.1 Pro",
    description: "최고 품질 추론 모델 (프리뷰)",
    tier: "premium",
    badge: "NEW",
    recommendedFor: "상세페이지 기획",
  },
};

interface GeminiRequestConfig {
  temperature?: number;
  topP?: number;
  maxOutputTokens?: number;
  responseMimeType?: string;
}

interface GeminiResponse {
  text: string;
  finishReason?: string;
}

interface CallGeminiOptions {
  apiKey: string;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  config?: GeminiRequestConfig;
}

// ─── SDK 방식 ─────────────────────────────────────────
async function callGeminiSdk(options: CallGeminiOptions): Promise<GeminiResponse> {
  const { apiKey, model, systemPrompt, userPrompt, config } = options;

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model,
    contents: userPrompt,
    config: {
      systemInstruction: systemPrompt,
      temperature: config?.temperature ?? 0.7,
      topP: config?.topP ?? 0.9,
      maxOutputTokens: config?.maxOutputTokens ?? 4096,
      ...(config?.responseMimeType && { responseMimeType: config.responseMimeType }),
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("AI 응답이 비어있습니다. 다시 시도해주세요.");
  }

  const finishReason = response.candidates?.[0]?.finishReason as string | undefined;

  return { text, finishReason };
}

// ─── REST API 폴백 방식 ──────────────────────────────
async function callGeminiRest(options: CallGeminiOptions): Promise<GeminiResponse> {
  const { apiKey, model, systemPrompt, userPrompt, config } = options;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature: config?.temperature ?? 0.7,
      topP: config?.topP ?? 0.9,
      maxOutputTokens: config?.maxOutputTokens ?? 4096,
      ...(config?.responseMimeType && { responseMimeType: config.responseMimeType }),
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    const message = errData?.error?.message || `Gemini API error (${res.status})`;

    if (res.status === 401 || res.status === 403) {
      throw Object.assign(new Error("API 키가 유효하지 않습니다. 확인 후 다시 시도해주세요."), { status: 401 });
    }
    if (res.status === 429) {
      throw Object.assign(new Error("요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요."), { status: 429 });
    }
    if (res.status === 503) {
      throw Object.assign(new Error("AI 서버가 바쁩니다. 잠시 후 다시 시도해주세요."), { status: 503 });
    }
    throw Object.assign(new Error(message), { status: res.status });
  }

  const data = await res.json();

  // Gemini 2.5 Flash는 "thinking" 파트를 별도로 반환함
  const parts = data?.candidates?.[0]?.content?.parts;
  let text: string | undefined;

  if (Array.isArray(parts)) {
    const nonThoughtParts = parts.filter(
      (p: { thought?: boolean; text?: string }) => !p.thought
    );
    text = nonThoughtParts.length > 0
      ? nonThoughtParts[nonThoughtParts.length - 1]?.text
      : parts[parts.length - 1]?.text;
  }

  if (!text) {
    throw new Error("AI 응답이 비어있습니다. 다시 시도해주세요.");
  }

  const finishReason = data?.candidates?.[0]?.finishReason;

  return { text, finishReason };
}

// ─── 통합 호출: SDK 우선, ByteString 에러 시 REST 폴백 ──
export async function callGemini(options: CallGeminiOptions): Promise<GeminiResponse> {
  try {
    return await callGeminiSdk(options);
  } catch (sdkError) {
    const msg = (sdkError as Error).message || "";

    // ByteString 인코딩 에러 → REST API 폴백
    if (msg.includes("ByteString") || msg.includes("character at index")) {
      console.warn("SDK ByteString error detected, falling back to REST API:", msg);
      return callGeminiRest(options);
    }

    // API 키/네트워크 에러 등은 그대로 throw
    throw sdkError;
  }
}
