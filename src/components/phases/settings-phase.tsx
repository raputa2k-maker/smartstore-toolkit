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
import type { ModelKey } from "@/lib/gemini/client";

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
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={() => handleModelChange("gemini-2.5-flash")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 rounded-lg border p-3 text-left text-sm transition-colors ${
                  store.settings.selectedModel === "gemini-2.5-flash"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium">Gemini 2.5 Flash</div>
                <div className="text-xs text-muted-foreground mt-0.5">안정 버전 (권장)</div>
              </motion.button>
              <motion.button
                type="button"
                onClick={() => handleModelChange("gemini-3-flash-preview")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 rounded-lg border p-3 text-left text-sm transition-colors ${
                  store.settings.selectedModel === "gemini-3-flash-preview"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-medium">Gemini 3 Flash</div>
                <div className="text-xs text-muted-foreground mt-0.5">최신 프리뷰</div>
              </motion.button>
            </div>
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
