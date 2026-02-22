"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ModelKey } from "@/lib/gemini/client";

interface ModelSelectorProps {
  selectedModel: ModelKey;
  apiKey: string;
  saveKey: boolean;
  onModelChange: (model: ModelKey) => void;
  onApiKeyChange: (key: string) => void;
  onSaveKeyToggle: (save: boolean) => void;
}

export function ModelSelector({
  selectedModel,
  apiKey,
  saveKey,
  onModelChange,
  onApiKeyChange,
  onSaveKeyToggle,
}: ModelSelectorProps) {
  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="space-y-3">
        <Label className="text-sm font-medium">AI 모델 선택</Label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onModelChange("gemini-2.5-flash")}
            className={`flex-1 rounded-lg border p-3 text-left text-sm transition-colors ${
              selectedModel === "gemini-2.5-flash"
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="font-medium">Gemini 2.5 Flash</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              안정 버전 (권장)
            </div>
          </button>
          <button
            type="button"
            onClick={() => onModelChange("gemini-3-flash-preview")}
            className={`flex-1 rounded-lg border p-3 text-left text-sm transition-colors ${
              selectedModel === "gemini-3-flash-preview"
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border hover:border-primary/50"
            }`}
          >
            <div className="font-medium">Gemini 3 Flash</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              최신 프리뷰
            </div>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>
          Google AI API 키 <span className="text-destructive">*</span>
        </Label>
        <Input
          type="password"
          placeholder="AIza..."
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
          required
        />
        <div className="flex items-center gap-2 mt-1">
          <Switch
            id="save-key"
            checked={saveKey}
            onCheckedChange={onSaveKeyToggle}
          />
          <Label htmlFor="save-key" className="text-xs text-muted-foreground cursor-pointer">
            브라우저에 API 키 저장
          </Label>
        </div>
        <p className="text-xs text-muted-foreground">
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:no-underline"
          >
            Google AI Studio
          </a>
          에서 무료 API 키를 발급받을 수 있습니다.
        </p>
      </div>
    </div>
  );
}
