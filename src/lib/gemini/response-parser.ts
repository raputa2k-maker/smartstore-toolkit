interface ParsedRecommendation {
  name: string;
  reasoning: string;
}

interface ParsedResponse {
  recommendations: ParsedRecommendation[];
}

export function parseGeminiResponse(text: string | undefined): ParsedResponse {
  if (!text) {
    throw new Error("AI 응답이 비어있습니다.");
  }

  // Try direct JSON parse first
  try {
    const parsed = JSON.parse(text);
    if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
      return parsed as ParsedResponse;
    }
  } catch {
    // Continue to extraction
  }

  // Try extracting JSON from markdown code block
  const jsonBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonBlockMatch) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1].trim());
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return parsed as ParsedResponse;
      }
    } catch {
      // Continue
    }
  }

  // Try finding JSON object in the text
  const jsonObjMatch = text.match(/\{[\s\S]*"recommendations"[\s\S]*\}/);
  if (jsonObjMatch) {
    try {
      const parsed = JSON.parse(jsonObjMatch[0]);
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        return parsed as ParsedResponse;
      }
    } catch {
      // Continue
    }
  }

  throw new Error("AI 응답을 파싱할 수 없습니다. 다시 시도해주세요.");
}
