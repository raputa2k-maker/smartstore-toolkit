import type { GeneratedPlan, GeneratedSection, CtaPlacement } from "@/types/detail-page";

// ─── 섹션 라벨 & 색상 매핑 ────────────────────────────
const SECTION_META: Record<string, { label: string; color: string; bg: string }> = {
  s0: { label: "S0. 프리 헤더", color: "#e74c3c", bg: "#fef2f2" },
  s1: { label: "S1. 후킹 섹션", color: "#f59e0b", bg: "#fffbeb" },
  s2: { label: "S2. 핵심 베네핏", color: "#10b981", bg: "#f0fdf4" },
  s3: { label: "S3. 사회적 증거 1차", color: "#3b82f6", bg: "#eff6ff" },
  s4: { label: "S4. 상품 상세 설명", color: "#6366f1", bg: "#eef2ff" },
  s5: { label: "S5. 주문제작 전용", color: "#8b5cf6", bg: "#f5f3ff" },
  s6: { label: "S6. 리뷰", color: "#ec4899", bg: "#fdf2f8" },
  s7: { label: "S7. FAQ", color: "#14b8a6", bg: "#f0fdfa" },
  s8: { label: "S8. 배송/교환/환불", color: "#64748b", bg: "#f8fafc" },
  s9: { label: "S9. 브랜드 스토리", color: "#a855f7", bg: "#faf5ff" },
};

interface PdfOptions {
  plan: GeneratedPlan;
  confirmedName: string;
  filename: string;
}

/**
 * 구조화된 기획안 데이터로 전문적인 PDF를 생성
 */
export async function generatePdf(options: PdfOptions): Promise<void> {
  const { plan, confirmedName, filename } = options;
  const html2pdf = (await import("html2pdf.js")).default;

  const htmlContent = buildDocumentHtml(plan, confirmedName);

  const container = document.createElement("div");
  container.innerHTML = htmlContent;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1a1a1a";
  document.body.appendChild(container);

  try {
    const pdfOptions = {
      margin: [12, 14, 12, 14],
      filename,
      image: { type: "jpeg" as const, quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        onclone: (clonedDoc: Document) => {
          const root = clonedDoc.documentElement;
          const overrides: Record<string, string> = {
            "--background": "#fcfcfc",
            "--foreground": "#1a1a1a",
            "--primary": "#1fad6a",
            "--muted": "#f0f0f0",
            "--border": "#dcdcdc",
          };
          for (const [key, val] of Object.entries(overrides)) {
            root.style.setProperty(key, val);
          }
        },
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      pagebreak: { mode: ["css", "legacy"] },
    };

    const targetElement = container.firstElementChild as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await html2pdf().set(pdfOptions as any).from(targetElement).save();
  } finally {
    document.body.removeChild(container);
  }
}

// ─── 레거시 호환: 마크다운 기반 PDF 생성 ────────────────
export async function generatePdfFromMarkdown(
  markdown: string,
  filename: string
): Promise<void> {
  const { marked } = await import("marked");
  const html2pdf = (await import("html2pdf.js")).default;

  const htmlContent = await marked.parse(markdown, { gfm: true, breaks: true });
  const styledHtml = `<div style="font-family:sans-serif;color:#1a1a1a;line-height:1.6;font-size:10.5pt;padding:8px;">${htmlContent}</div>`;

  const container = document.createElement("div");
  container.innerHTML = styledHtml;
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  document.body.appendChild(container);

  try {
    const pdfOptions = {
      margin: [12, 14, 12, 14],
      filename,
      image: { type: "jpeg" as const, quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      pagebreak: { mode: ["css", "legacy"] },
    };
    const target = container.firstElementChild as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await html2pdf().set(pdfOptions as any).from(target).save();
  } finally {
    document.body.removeChild(container);
  }
}

// ─── 문서 전체 HTML 빌드 ──────────────────────────────
function buildDocumentHtml(plan: GeneratedPlan, confirmedName: string): string {
  const enabledSections = plan.sections.filter((s) => s.enabled);

  return `
<div class="pdf-root">
  <style>${getStyles()}</style>

  <!-- 헤더 -->
  <div class="doc-header">
    <div class="doc-header-badge">기획안</div>
    <h1 class="doc-title">${escapeHtml(confirmedName)} 상세페이지</h1>
    <div class="doc-meta">
      <span>총 ${enabledSections.length}개 섹션</span>
      <span class="meta-dot"></span>
      <span>${new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}</span>
    </div>
  </div>

  <!-- 섹션 목차 -->
  <div class="toc-bar">
    ${enabledSections.map((s) => {
      const meta = SECTION_META[s.sectionId];
      return `<span class="toc-chip" style="background:${meta?.bg || "#f5f5f5"};color:${meta?.color || "#333"};border:1px solid ${meta?.color || "#ddd"}30">${meta?.label || s.title}</span>`;
    }).join("")}
  </div>

  <!-- 섹션 카드 -->
  ${enabledSections.map((section) => renderSectionCard(section)).join("")}

  <!-- CTA 배치 -->
  ${plan.ctaPlacements.length > 0 ? renderCtaSection(plan.ctaPlacements) : ""}

  <!-- 부가 정보 -->
  ${plan.seoNotes ? renderInfoBox("SEO 노트", plan.seoNotes, "#10b981", "#f0fdf4") : ""}
  ${plan.mobileChecklist.length > 0 ? renderChecklist("모바일 최적화 체크리스트", plan.mobileChecklist, "#3b82f6", "#eff6ff") : ""}
  ${plan.industrySpecificNotes.length > 0 ? renderChecklist("업종별 특화 조언", plan.industrySpecificNotes, "#8b5cf6", "#f5f3ff") : ""}
  ${plan.estimatedScrollDepth ? renderInfoBox("예상 스크롤 깊이", plan.estimatedScrollDepth, "#f59e0b", "#fffbeb") : ""}

  <!-- 푸터 -->
  <div class="doc-footer">
    스마트스토어 올인원 기획 도구로 생성됨
  </div>
</div>`;
}

// ─── 섹션 카드 렌더링 ──────────────────────────────────
function renderSectionCard(section: GeneratedSection): string {
  const meta = SECTION_META[section.sectionId] || {
    label: section.title,
    color: "#6b7280",
    bg: "#f9fafb",
  };

  // content 내의 줄바꿈을 <br>로, **bold**를 <strong>으로 변환
  const formattedContent = formatContent(section.content);

  let html = `
  <div class="section-card" style="border-left-color:${meta.color}">
    <div class="section-header" style="background:${meta.bg}">
      <span class="section-label" style="color:${meta.color}">${meta.label}</span>
      <span class="section-title">${escapeHtml(section.title)}</span>
    </div>
    <div class="section-body">
      <div class="section-content">${formattedContent}</div>`;

  // 카피라이팅 팁
  if (section.copywritingTips.length > 0) {
    html += `
      <div class="tip-box">
        <div class="tip-header">
          <span class="tip-icon">&#128161;</span>
          <span class="tip-label">카피라이팅 팁</span>
        </div>
        <ul class="tip-list">
          ${section.copywritingTips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}
        </ul>
      </div>`;
  }

  // 디자인 노트
  if (section.designNotes) {
    html += `
      <div class="design-box">
        <div class="tip-header">
          <span class="tip-icon">&#127912;</span>
          <span class="tip-label">디자인 노트</span>
        </div>
        <p class="design-text">${escapeHtml(section.designNotes)}</p>
      </div>`;
  }

  html += `
    </div>
  </div>`;

  return html;
}

// ─── CTA 배치 섹션 ─────────────────────────────────────
function renderCtaSection(placements: CtaPlacement[]): string {
  return `
  <div class="extra-section">
    <div class="extra-header" style="color:#e74c3c">
      <span>&#128073;</span> CTA 버튼 배치
    </div>
    <div class="cta-grid">
      ${placements.map((cta) => {
        const sLabel = SECTION_META[cta.afterSection]?.label || cta.afterSection;
        return `
        <div class="cta-item">
          <span class="cta-position">${sLabel} 다음</span>
          <span class="cta-text">${escapeHtml(cta.ctaText)}</span>
          <span class="cta-style">${escapeHtml(cta.ctaStyle)}</span>
        </div>`;
      }).join("")}
    </div>
  </div>`;
}

// ─── 정보 박스 ─────────────────────────────────────────
function renderInfoBox(title: string, content: string, color: string, bg: string): string {
  return `
  <div class="info-box" style="border-left-color:${color};background:${bg}">
    <div class="info-title" style="color:${color}">${title}</div>
    <p class="info-text">${escapeHtml(content)}</p>
  </div>`;
}

// ─── 체크리스트 ────────────────────────────────────────
function renderChecklist(title: string, items: string[], color: string, bg: string): string {
  return `
  <div class="info-box" style="border-left-color:${color};background:${bg}">
    <div class="info-title" style="color:${color}">${title}</div>
    <ul class="check-list">
      ${items.map((item, i) => `<li><span class="check-num" style="background:${color}">${i + 1}</span> ${escapeHtml(item)}</li>`).join("")}
    </ul>
  </div>`;
}

// ─── 콘텐츠 포맷팅 ────────────────────────────────────
function formatContent(text: string): string {
  let html = escapeHtml(text);
  // **bold** → <strong>
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // 줄바꿈
  html = html.replace(/\n/g, "<br>");
  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── 스타일 시트 ───────────────────────────────────────
function getStyles(): string {
  return `
    .pdf-root {
      font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      line-height: 1.55;
      font-size: 10pt;
      max-width: 100%;
    }

    /* ─── 페이지 분할 방지 ─── */
    .section-card { break-inside: avoid; page-break-inside: avoid; }
    .tip-box, .design-box { break-inside: avoid; page-break-inside: avoid; }
    .info-box { break-inside: avoid; page-break-inside: avoid; }
    .cta-item { break-inside: avoid; page-break-inside: avoid; }
    .extra-section { break-inside: avoid; page-break-inside: avoid; }

    /* ─── 문서 헤더 ─── */
    .doc-header {
      text-align: center;
      padding: 16pt 0 12pt 0;
      margin-bottom: 10pt;
      border-bottom: 2pt solid #10b981;
    }
    .doc-header-badge {
      display: inline-block;
      background: #10b981;
      color: white;
      font-size: 8pt;
      font-weight: 700;
      padding: 2pt 10pt;
      border-radius: 10pt;
      margin-bottom: 6pt;
      letter-spacing: 1pt;
      text-transform: uppercase;
    }
    .doc-title {
      font-size: 17pt;
      font-weight: 800;
      color: #111;
      margin: 4pt 0 6pt 0;
      line-height: 1.3;
    }
    .doc-meta {
      font-size: 8.5pt;
      color: #888;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 6pt;
    }
    .meta-dot {
      display: inline-block;
      width: 3pt;
      height: 3pt;
      border-radius: 50%;
      background: #ccc;
    }

    /* ─── 목차 바 ─── */
    .toc-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 4pt;
      margin-bottom: 12pt;
      padding: 8pt 10pt;
      background: #f9fafb;
      border-radius: 6pt;
      border: 0.5pt solid #e5e7eb;
    }
    .toc-chip {
      font-size: 7pt;
      font-weight: 600;
      padding: 2pt 7pt;
      border-radius: 8pt;
      white-space: nowrap;
    }

    /* ─── 섹션 카드 ─── */
    .section-card {
      border: 0.5pt solid #e5e7eb;
      border-left: 3pt solid #ccc;
      border-radius: 6pt;
      margin-bottom: 10pt;
      overflow: hidden;
    }
    .section-header {
      padding: 6pt 10pt;
      display: flex;
      align-items: center;
      gap: 6pt;
      border-bottom: 0.5pt solid #e5e7eb;
    }
    .section-label {
      font-size: 7.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3pt;
      white-space: nowrap;
    }
    .section-title {
      font-size: 10pt;
      font-weight: 600;
      color: #333;
    }
    .section-body {
      padding: 8pt 10pt;
    }
    .section-content {
      font-size: 9.5pt;
      line-height: 1.6;
      color: #333;
      margin-bottom: 4pt;
    }
    .section-content strong {
      font-weight: 700;
      color: #1a1a1a;
    }

    /* ─── 팁 박스 ─── */
    .tip-box {
      background: #fffbeb;
      border: 0.5pt solid #fde68a;
      border-radius: 4pt;
      padding: 6pt 8pt;
      margin-top: 6pt;
    }
    .tip-header {
      display: flex;
      align-items: center;
      gap: 4pt;
      margin-bottom: 3pt;
    }
    .tip-icon { font-size: 10pt; }
    .tip-label {
      font-size: 8pt;
      font-weight: 700;
      color: #92400e;
    }
    .tip-list {
      margin: 0;
      padding-left: 14pt;
      font-size: 8.5pt;
      color: #78350f;
      line-height: 1.5;
    }
    .tip-list li { margin-bottom: 1pt; }

    /* ─── 디자인 노트 박스 ─── */
    .design-box {
      background: #eff6ff;
      border: 0.5pt solid #bfdbfe;
      border-radius: 4pt;
      padding: 6pt 8pt;
      margin-top: 6pt;
    }
    .design-box .tip-label { color: #1e40af; }
    .design-text {
      font-size: 8.5pt;
      color: #1e3a5f;
      margin: 0;
      line-height: 1.5;
    }

    /* ─── CTA 섹션 ─── */
    .extra-section {
      margin: 10pt 0;
      border: 0.5pt solid #e5e7eb;
      border-radius: 6pt;
      overflow: hidden;
    }
    .extra-header {
      font-size: 10pt;
      font-weight: 700;
      padding: 6pt 10pt;
      background: #f9fafb;
      border-bottom: 0.5pt solid #e5e7eb;
    }
    .cta-grid { padding: 8pt 10pt; }
    .cta-item {
      display: flex;
      align-items: center;
      gap: 8pt;
      padding: 5pt 8pt;
      margin-bottom: 4pt;
      background: #fef2f2;
      border-radius: 4pt;
      font-size: 8.5pt;
    }
    .cta-position {
      font-size: 7.5pt;
      color: #6b7280;
      background: #fff;
      padding: 1pt 6pt;
      border-radius: 6pt;
      border: 0.5pt solid #e5e7eb;
      white-space: nowrap;
    }
    .cta-text { font-weight: 600; color: #dc2626; flex: 1; }
    .cta-style {
      font-size: 7.5pt;
      color: #6b7280;
      background: #fff;
      padding: 1pt 6pt;
      border-radius: 6pt;
      border: 0.5pt solid #e5e7eb;
    }

    /* ─── 정보 박스 ─── */
    .info-box {
      border-left: 3pt solid #ccc;
      border-radius: 4pt;
      padding: 8pt 10pt;
      margin-bottom: 8pt;
    }
    .info-title {
      font-size: 9pt;
      font-weight: 700;
      margin-bottom: 3pt;
    }
    .info-text {
      font-size: 8.5pt;
      color: #555;
      margin: 0;
      line-height: 1.5;
    }
    .check-list {
      margin: 0;
      padding: 0;
      list-style: none;
      font-size: 8.5pt;
      color: #444;
    }
    .check-list li {
      display: flex;
      align-items: flex-start;
      gap: 5pt;
      margin-bottom: 3pt;
      line-height: 1.5;
    }
    .check-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 13pt;
      height: 13pt;
      border-radius: 50%;
      color: #fff;
      font-size: 7pt;
      font-weight: 700;
      flex-shrink: 0;
      margin-top: 1pt;
    }

    /* ─── 푸터 ─── */
    .doc-footer {
      margin-top: 14pt;
      padding-top: 8pt;
      border-top: 0.5pt solid #e5e7eb;
      text-align: center;
      font-size: 7.5pt;
      color: #aaa;
    }
  `;
}
