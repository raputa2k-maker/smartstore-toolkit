"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhaseStore } from "@/hooks/use-phase-store";
import { Plus, Trash2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReviewItem } from "@/types/detail-page";

export function S6ReviewsForm() {
  const { store, updateDetailSection } = usePhaseStore();
  const data = store.detailInput.s6;

  const addReview = () => {
    updateDetailSection("s6", {
      ...data,
      highlightReviews: [
        ...data.highlightReviews,
        { reviewer: "", rating: 5, content: "", option: "" },
      ],
    });
  };

  const updateReview = (index: number, field: keyof ReviewItem, value: string | number) => {
    const updated = data.highlightReviews.map((r, i) =>
      i === index ? { ...r, [field]: value } : r
    );
    updateDetailSection("s6", { ...data, highlightReviews: updated });
  };

  const removeReview = (index: number) => {
    updateDetailSection("s6", {
      ...data,
      highlightReviews: data.highlightReviews.filter((_, i) => i !== index),
    });
  };

  const updateField = (field: string, value: string) => {
    updateDetailSection("s6", { ...data, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>전체 리뷰 수</Label>
          <Input
            placeholder="예: 1,234"
            value={data.totalReviewCount}
            onChange={(e) => updateField("totalReviewCount", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>평균 평점</Label>
          <Input
            placeholder="예: 4.8"
            value={data.averageRating}
            onChange={(e) => updateField("averageRating", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>하이라이트 리뷰</Label>
          <span className="text-xs text-muted-foreground">
            {data.highlightReviews.length}개
          </span>
        </div>

        <AnimatePresence initial={false}>
          {data.highlightReviews.map((review, index) => (
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
                    리뷰 {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeReview(index)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-xs">작성자</Label>
                    <Input
                      placeholder="예: 김** 님"
                      value={review.reviewer}
                      onChange={(e) => updateReview(index, "reviewer", e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">구매 옵션</Label>
                    <Input
                      placeholder="예: 블랙 / L"
                      value={review.option}
                      onChange={(e) => updateReview(index, "option", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">평점</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => updateReview(index, "rating", star)}
                        className="p-0.5"
                      >
                        <Star
                          className={cn(
                            "h-5 w-5",
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs">리뷰 내용</Label>
                  <Textarea
                    placeholder="리뷰 내용을 입력해 주세요"
                    value={review.content}
                    onChange={(e) => updateReview(index, "content", e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <Button type="button" variant="outline" onClick={addReview} className="w-full">
          <Plus className="mr-1 h-4 w-4" />
          리뷰 추가
        </Button>
      </div>
    </div>
  );
}
