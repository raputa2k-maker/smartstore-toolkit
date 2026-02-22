"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "gemini-api-key";

export function useApiKey() {
  const [apiKey, setApiKey] = useState("");
  const [saveKey, setSaveKey] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKey(stored);
      setSaveKey(true);
    }
  }, []);

  const updateApiKey = useCallback(
    (key: string) => {
      setApiKey(key);
      if (saveKey) {
        localStorage.setItem(STORAGE_KEY, key);
      }
    },
    [saveKey]
  );

  const toggleSave = useCallback(
    (save: boolean) => {
      setSaveKey(save);
      if (save && apiKey) {
        localStorage.setItem(STORAGE_KEY, apiKey);
      } else if (!save) {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    [apiKey]
  );

  return { apiKey, saveKey, updateApiKey, toggleSave };
}
