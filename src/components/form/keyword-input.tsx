"use client";

import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface KeywordInputProps {
  keywords: string[];
  onChange: (keywords: string[]) => void;
}

export function KeywordInput({ keywords, onChange }: KeywordInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addKeyword = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      onChange([...keywords, trimmed]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addKeyword(inputValue);
      setInputValue("");
    }
    if (e.key === "Backspace" && inputValue === "" && keywords.length > 0) {
      onChange(keywords.slice(0, -1));
    }
  };

  const removeKeyword = (idx: number) => {
    onChange(keywords.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <Label>핵심 키워드</Label>
      <div className="flex flex-wrap gap-1.5 rounded-md border border-input bg-background p-2 focus-within:ring-2 focus-within:ring-ring">
        {keywords.map((kw, idx) => (
          <Badge
            key={idx}
            variant="secondary"
            className="gap-1 pl-2 pr-1 text-sm"
          >
            {kw}
            <button
              type="button"
              onClick={() => removeKeyword(idx)}
              className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <Input
          className="min-w-[120px] flex-1 border-0 p-0 shadow-none focus-visible:ring-0 h-7 text-sm"
          placeholder={
            keywords.length === 0 ? "키워드 입력 후 Enter (쉼표 구분)" : ""
          }
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (inputValue.trim()) {
              addKeyword(inputValue);
              setInputValue("");
            }
          }}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Enter 또는 쉼표로 키워드를 추가하세요
      </p>
    </div>
  );
}
