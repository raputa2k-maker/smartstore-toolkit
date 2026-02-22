"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { Plus, Trash2 } from "lucide-react";
import type { FaqItem } from "@/types/detail-page";

const FAQ_CATEGORIES = [
  { value: "quality", label: "품질" },
  { value: "size", label: "사이즈" },
  { value: "shipping", label: "배송" },
  { value: "exchange", label: "교환/환불" },
  { value: "custom", label: "주문제작" },
  { value: "etc", label: "기타" },
];

export function S7FaqForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s7;

  const addFaq = () => {
    updateDetailSection("s7", {
      faqs: [...data.faqs, { category: "", question: "", answer: "" }],
    });
  };

  const updateFaq = (index: number, field: keyof FaqItem, value: string) => {
    const updated = data.faqs.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    updateDetailSection("s7", { faqs: updated });
  };

  const removeFaq = (index: number) => {
    if (data.faqs.length <= 1) return;
    updateDetailSection("s7", {
      faqs: data.faqs.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          자주 묻는 질문 <span className="text-destructive">*</span>
        </Label>
        <span className="text-xs text-muted-foreground">
          {data.faqs.length}개
        </span>
      </div>

      <AnimatePresence initial={false}>
        {data.faqs.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  FAQ {index + 1}
                </span>
                {data.faqs.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaq(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-xs">카테고리</Label>
                <Select
                  value={faq.category}
                  onValueChange={(value) => updateFaq(index, "category", value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs">
                  질문 <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="예: 세탁 방법은 어떻게 되나요?"
                  value={faq.question}
                  onChange={(e) => updateFaq(index, "question", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-xs">
                  답변 <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  placeholder="질문에 대한 답변을 입력해 주세요"
                  value={faq.answer}
                  onChange={(e) => updateFaq(index, "answer", e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <Button type="button" variant="outline" onClick={addFaq} className="w-full">
        <Plus className="mr-1 h-4 w-4" />
        FAQ 추가
      </Button>
    </div>
  );
}
