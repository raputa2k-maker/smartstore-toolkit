"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { MODEL_INFO } from "@/lib/gemini/client";
import type { ModelKey } from "@/lib/gemini/client";
import { Zap, Sparkles, Crown } from "lucide-react";

const TIER_ICON = {
  budget: Zap,
  balanced: Sparkles,
  premium: Crown,
} as const;

const TIER_COLORS = {
  budget: {
    selected: "border-blue-500 bg-blue-50 text-foreground",
    hover: "border-border hover:border-blue-400/60",
    icon: "text-blue-500",
    badge: "bg-blue-100 text-blue-700",
  },
  balanced: {
    selected: "border-primary bg-primary/5 text-foreground",
    hover: "border-border hover:border-primary/50",
    icon: "text-primary",
    badge: "bg-emerald-100 text-emerald-700",
  },
  premium: {
    selected: "border-amber-500 bg-amber-50 text-foreground",
    hover: "border-border hover:border-amber-400/60",
    icon: "text-amber-500",
    badge: "bg-amber-100 text-amber-700",
  },
} as const;

const MODEL_ORDER: ModelKey[] = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3-flash-preview",
  "gemini-3.1-pro-preview",
];

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
        <div className="grid grid-cols-2 gap-3">
          {MODEL_ORDER.map((key) => {
            const info = MODEL_INFO[key];
            const isSelected = selectedModel === key;
            const colors = TIER_COLORS[info.tier];
            const Icon = TIER_ICON[info.tier];

            return (
              <button
                key={key}
                type="button"
                onClick={() => onModelChange(key)}
                className={`relative rounded-lg border p-3 text-left text-sm transition-colors ${
                  isSelected ? colors.selected : colors.hover
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <Icon className={`h-3.5 w-3.5 ${colors.icon}`} />
                  <span className="font-medium">{info.label}</span>
                  {info.badge && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${colors.badge}`}>
                      {info.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {info.description}
                </div>
              </button>
            );
          })}
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
