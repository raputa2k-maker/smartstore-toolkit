"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhaseNavigation } from "@/components/phase/phase-navigation";
import { usePhaseStore } from "@/hooks/use-phase-store";
import {
  Copy,
  Check,
  Download,
  FileText,
  FileDown,
  AlertCircle,
  Search,
  Smartphone,
  Briefcase,
  Ruler,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { StaggerContainer, staggerItemVariants } from "@/components/motion/stagger-container";
import { toast } from "sonner";

export function PreviewPhase() {
  const { store } = usePhaseStore();
  const [copied, setCopied] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const generated = store.generated;

  // ─── 기획안 미생성 안내 ───
  if (!generated) {
    return (
      <div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                기획안이 생성되지 않았습니다
              </h3>
              <p className="text-sm text-muted-foreground">
                이전 단계에서 AI 기획안을 먼저 생성해주세요.
              </p>
            </div>
          </CardContent>
        </Card>

        <PhaseNavigation showNext={false} showPrev={true} />
      </div>
    );
  }

  // ─── 마크다운 복사 ───
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generated.fullMarkdown);
      setCopied(true);
      toast.success("마크다운이 클립보드에 복사되었습니다.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다. 브라우저 권한을 확인해주세요.");
    }
  };

  // ─── 마크다운 다운로드 ───
  const handleDownload = () => {
    const blob = new Blob([generated.fullMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    const safeName = store.seoCheck.confirmedName
      .replace(/[<>:"/\\|?*]/g, "_")
      .slice(0, 50);
    a.download = `상세페이지_기획안_${safeName}.md`;

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("마크다운 파일이 다운로드되었습니다.");
  };

  // ─── PDF 다운로드 ───
  const handlePdfDownload = async () => {
    setPdfLoading(true);
    try {
      const { generatePdf } = await import("@/lib/pdf/generate-pdf");
      const safeName = store.seoCheck.confirmedName
        .replace(/[<>:"/\\|?*]/g, "_")
        .slice(0, 50);
      await generatePdf(
        generated.fullMarkdown,
        `상세페이지_기획안_${safeName}.pdf`
      );
      toast.success("PDF 파일이 다운로드되었습니다.");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error("PDF 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <StaggerContainer className="space-y-4">
      {/* ─── 내보내기 버튼 영역 ─── */}
      <motion.div variants={staggerItemVariants}>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">기획안 내보내기</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="mr-1.5 h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="mr-1.5 h-4 w-4" />
                )}
                {copied ? "복사됨" : "마크다운 복사"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-1.5 h-4 w-4" />
                마크다운 다운로드
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePdfDownload}
                disabled={pdfLoading}
              >
                {pdfLoading ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="mr-1.5 h-4 w-4" />
                )}
                {pdfLoading ? "PDF 생성 중..." : "PDF 다운로드"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* ─── 마크다운 프리뷰 ─── */}
      <motion.div variants={staggerItemVariants}>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">기획안 미리보기</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/30 rounded-lg p-6 border">
            <pre className="text-sm whitespace-pre-wrap break-words font-sans leading-relaxed">
              {generated.fullMarkdown}
            </pre>
          </div>
        </CardContent>
      </Card>
      </motion.div>

      {/* ─── SEO 노트 ─── */}
      {generated.seoNotes && (
        <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-1.5">
              <Search className="h-4 w-4 text-green-600" />
              <CardTitle className="text-base">SEO 관련 노트</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {generated.seoNotes}
            </p>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* ─── 모바일 체크리스트 ─── */}
      {generated.mobileChecklist.length > 0 && (
        <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-4 w-4 text-blue-500" />
              <CardTitle className="text-base">모바일 최적화 체크리스트</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {generated.mobileChecklist.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-medium shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* ─── 예상 스크롤 깊이 ─── */}
      {generated.estimatedScrollDepth && (
        <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-orange-500" />
              <CardTitle className="text-base">예상 스크롤 깊이</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {generated.estimatedScrollDepth}
            </p>
          </CardContent>
        </Card>
        </motion.div>
      )}

      {/* ─── 업종별 특수 노트 ─── */}
      {generated.industrySpecificNotes.length > 0 && (
        <motion.div variants={staggerItemVariants}>
        <Card>
          <CardHeader className="pb-0">
            <div className="flex items-center gap-1.5">
              <Briefcase className="h-4 w-4 text-purple-500" />
              <CardTitle className="text-base">업종별 특화 조언</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {generated.industrySpecificNotes.map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Badge variant="outline" className="text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </Badge>
                  <span className="text-muted-foreground">{note}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        </motion.div>
      )}

      <PhaseNavigation showNext={false} showPrev={true} />
    </StaggerContainer>
  );
}
