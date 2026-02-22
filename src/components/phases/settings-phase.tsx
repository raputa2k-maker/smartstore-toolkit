"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PhaseNavigation } from "@/components/phase/phase-navigation";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { usePhase } from "@/hooks/use-phase";
import { useApiKey } from "@/hooks/use-api-key";
import { useEffect } from "react";
import { motion } from "framer-motion";
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

export function SettingsPhase() {
  const { store, updateSettings } = usePhaseStore();
  const { completeAndNext } = usePhase();
  const { apiKey: savedKey, saveKey: savedSaveKey, updateApiKey, toggleSave } = useApiKey();

  // Sync localStorage API key on mount
  useEffect(() => {
    if (savedKey && !store.settings.apiKey) {
      updateSettings({ apiKey: savedKey, saveKey: savedSaveKey });
    }
  }, [savedKey, savedSaveKey, store.settings.apiKey, updateSettings]);

  const handleApiKeyChange = (key: string) => {
    updateSettings({ apiKey: key });
    updateApiKey(key);
  };

  const handleSaveToggle = (save: boolean) => {
    updateSettings({ saveKey: save });
    toggleSave(save);
  };

  const handleModelChange = (model: ModelKey) => {
    updateSettings({ selectedModel: model });
  };

  const canProceed = store.settings.apiKey.trim().length > 0;

  return (
    <div>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-medium">AI 모델 선택</Label>
            <div className="grid grid-cols-2 gap-3">
              {MODEL_ORDER.map((key) => {
                const info = MODEL_INFO[key];
                const isSelected = store.settings.selectedModel === key;
                const colors = TIER_COLORS[info.tier];
                const Icon = TIER_ICON[info.tier];

                return (
                  <motion.button
                    key={key}
                    type="button"
                    onClick={() => handleModelChange(key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
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
                    {info.recommendedFor && (
                      <div className="text-[11px] text-muted-foreground/80 mt-1 italic">
                        {info.recommendedFor}에 추천
                      </div>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              작업별로 다른 모델을 사용하려면 각 단계에서 모델을 변경할 수 있습니다.
            </p>
          </div>

          <div className="space-y-2">
            <Label>
              Google AI API 키 <span className="text-destructive">*</span>
            </Label>
            <Input
              type="password"
              placeholder="AIza..."
              value={store.settings.apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
            />
            <div className="flex items-center gap-2 mt-1">
              <Switch
                id="save-key-phase"
                checked={store.settings.saveKey}
                onCheckedChange={handleSaveToggle}
              />
              <Label htmlFor="save-key-phase" className="text-xs text-muted-foreground cursor-pointer">
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
        </CardContent>
      </Card>

      <PhaseNavigation
        showPrev={false}
        onNext={() => completeAndNext("settings")}
        nextDisabled={!canProceed}
        nextLabel="다음: 상품 정보 입력"
      />
    </div>
  );
}
