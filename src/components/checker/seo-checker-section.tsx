"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CheckResult } from "./check-result";
import { useSeoCheck } from "@/hooks/use-seo-check";
import { Search } from "lucide-react";

export function SeoCheckerSection() {
  const [nameInput, setNameInput] = useState("");
  const { checkResults, hasChecked, check, clearCheck } = useSeoCheck();

  const handleCheck = () => {
    if (nameInput.trim()) {
      check(nameInput.trim());
    }
  };

  const handleClear = () => {
    setNameInput("");
    clearCheck();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-primary" />
          SEO 가이드라인 체크
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          상품명을 직접 입력하여 네이버 SEO 가이드라인 준수 여부를 검사합니다.
        </p>

        <div className="space-y-2">
          <div className="relative">
            <Textarea
              placeholder="검사할 상품명을 입력하세요"
              value={nameInput}
              onChange={(e) => {
                setNameInput(e.target.value);
                if (hasChecked) clearCheck();
              }}
              rows={2}
              className="pr-16 resize-none"
            />
            <span
              className={`absolute bottom-2 right-3 text-xs ${
                nameInput.length > 50
                  ? nameInput.length > 100
                    ? "text-red-500"
                    : "text-amber-500"
                  : "text-muted-foreground"
              }`}
            >
              {nameInput.length}자
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleCheck}
              disabled={!nameInput.trim()}
              className="flex-1 sm:flex-none"
            >
              <Search className="mr-2 h-4 w-4" />
              검사하기
            </Button>
            {hasChecked && (
              <Button variant="outline" onClick={handleClear}>
                초기화
              </Button>
            )}
          </div>
        </div>

        {hasChecked && <CheckResult results={checkResults} />}
      </CardContent>
    </Card>
  );
}
