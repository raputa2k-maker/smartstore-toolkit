import { marked } from "marked";

/**
 * 마크다운을 PDF로 변환하여 다운로드
 * html2pdf.js는 dynamic import로 로드 (SSR 방지, 번들 최적화)
 */
export async function generatePdf(
  markdown: string,
  filename: string
): Promise<void> {
  // html2pdf.js는 window/document를 사용하므로 dynamic import
  const html2pdf = (await import("html2pdf.js")).default;

  // 마크다운 → HTML 변환
  const htmlContent = await marked.parse(markdown, {
    gfm: true,
    breaks: true,
  });

  // 섹션 래핑 (heading + content를 그룹화하여 페이지 분할 시 잘림 방지)
  const wrappedHtml = wrapSections(htmlContent);

  // 인쇄용 스타일이 적용된 HTML 래퍼
  const styledHtml = buildStyledHtml(wrappedHtml);

  // 임시 DOM 요소 생성 (html2canvas가 렌더링에 사용)
  const container = document.createElement("div");
  container.innerHTML = styledHtml;
  // 화면에 보이지 않게 위치시키되, html2canvas가 렌더링할 수 있도록 DOM에 추가
  container.style.position = "fixed";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px"; // A4 비율에 맞는 고정 너비
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#1a1a1a";
  document.body.appendChild(container);

  try {
    const options = {
      margin: [10, 10, 10, 10], // 상하좌우 10mm (기존 15mm에서 축소)
      filename,
      image: { type: "jpeg" as const, quality: 0.95 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        logging: false,
        // oklch() 색상을 html2canvas가 파싱할 수 없으므로,
        // 클론된 문서에서 CSS 변수를 hex 값으로 오버라이드
        onclone: (clonedDoc: Document) => {
          const root = clonedDoc.documentElement;
          const overrides: Record<string, string> = {
            "--background": "#fcfcfc",
            "--foreground": "#1a1a1a",
            "--card": "#ffffff",
            "--card-foreground": "#1a1a1a",
            "--popover": "#ffffff",
            "--popover-foreground": "#1a1a1a",
            "--primary": "#1fad6a",
            "--primary-foreground": "#ffffff",
            "--secondary": "#eef8f2",
            "--secondary-foreground": "#1a3a28",
            "--muted": "#f0f0f0",
            "--muted-foreground": "#6e6e6e",
            "--accent": "#eef8f2",
            "--accent-foreground": "#1a3a28",
            "--destructive": "#e23636",
            "--border": "#dcdcdc",
            "--input": "#dcdcdc",
            "--ring": "#1fad6a",
          };
          for (const [key, val] of Object.entries(overrides)) {
            root.style.setProperty(key, val);
          }
        },
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait" as const,
      },
      pagebreak: {
        // css 모드: CSS break-* 속성을 존중
        // legacy 모드: 기존 page-break-* 속성도 존중
        mode: ["css", "legacy"],
      },
    };

    const targetElement = container.firstElementChild as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await html2pdf().set(options as any).from(targetElement).save();
  } finally {
    document.body.removeChild(container);
  }
}

/**
 * HTML을 파싱하여 heading + 연속 콘텐츠를 .pdf-section으로 그룹핑
 * 이렇게 하면 heading이 콘텐츠와 분리되어 페이지가 잘리는 것을 방지
 */
function wrapSections(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${html}</div>`, "text/html");
  const root = doc.body.firstElementChild;
  if (!root) return html;

  const headingTags = new Set(["H1", "H2", "H3", "H4"]);
  const result = doc.createElement("div");
  let currentSection: HTMLElement | null = null;

  Array.from(root.childNodes).forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as HTMLElement;

      // hr은 섹션 구분자 — 현재 섹션을 닫고 hr을 직접 추가
      if (el.tagName === "HR") {
        if (currentSection) {
          result.appendChild(currentSection);
          currentSection = null;
        }
        result.appendChild(el.cloneNode(true));
        return;
      }

      // heading을 만나면 새 섹션 시작
      if (headingTags.has(el.tagName)) {
        // 이전 섹션 닫기
        if (currentSection) {
          result.appendChild(currentSection);
        }
        currentSection = doc.createElement("div");
        currentSection.className = "pdf-section";
        currentSection.appendChild(el.cloneNode(true));
        return;
      }
    }

    // heading이 아닌 노드는 현재 섹션에 추가
    if (currentSection) {
      currentSection.appendChild(node.cloneNode(true));
    } else {
      // 섹션 없이 시작된 콘텐츠
      result.appendChild(node.cloneNode(true));
    }
  });

  // 마지막 섹션 닫기
  if (currentSection) {
    result.appendChild(currentSection);
  }

  return result.innerHTML;
}

function buildStyledHtml(htmlContent: string): string {
  return `
    <div style="
      font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      line-height: 1.55;
      font-size: 10.5pt;
      max-width: 100%;
      padding: 4px;
    ">
      <style>
        /* ─── 페이지 분할 방지 ─── */
        .pdf-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        h1, h2, h3, h4 {
          break-after: avoid;
          page-break-after: avoid;
        }
        li, tr, blockquote, pre {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        table {
          break-inside: avoid;
          page-break-inside: avoid;
        }
        ul, ol {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        /* ─── 타이포그래피 (간격 축소) ─── */
        h1 {
          font-size: 16pt; font-weight: 700;
          margin: 10pt 0 4pt 0;
          color: #111;
        }
        h2 {
          font-size: 13.5pt; font-weight: 700;
          margin: 10pt 0 3pt 0;
          color: #222;
          border-bottom: 1pt solid #e0e0e0;
          padding-bottom: 3pt;
        }
        h3 {
          font-size: 11.5pt; font-weight: 600;
          margin: 8pt 0 2pt 0;
          color: #333;
        }
        h4 {
          font-size: 10.5pt; font-weight: 600;
          margin: 6pt 0 2pt 0;
          color: #444;
        }
        p {
          margin: 0 0 5pt 0;
        }
        strong { font-weight: 600; }

        /* ─── 리스트 ─── */
        ul, ol {
          margin: 2pt 0 6pt 0;
          padding-left: 18pt;
        }
        li {
          margin-bottom: 1pt;
        }

        /* ─── 구분선 ─── */
        hr {
          border: none;
          border-top: 0.5pt solid #ddd;
          margin: 8pt 0;
        }

        /* ─── 테이블 ─── */
        table {
          width: 100%; border-collapse: collapse;
          margin: 6pt 0; font-size: 9.5pt;
        }
        th {
          background: #f5f5f5; font-weight: 600; text-align: left;
          padding: 4pt 6pt; border: 0.5pt solid #ddd;
        }
        td {
          padding: 3pt 6pt; border: 0.5pt solid #ddd;
        }
        tr:nth-child(even) td { background: #fafafa; }

        /* ─── 인라인 코드 ─── */
        code {
          background: #f4f4f4; padding: 1pt 3pt; border-radius: 2pt;
          font-size: 9.5pt;
        }

        /* ─── 인용 ─── */
        blockquote {
          border-left: 2.5pt solid #10b981;
          margin: 6pt 0; padding: 4pt 12pt;
          color: #555; background: #f0fdf4;
          border-radius: 0 3pt 3pt 0;
        }

        img { max-width: 100%; }
      </style>
      ${htmlContent}
    </div>
  `;
}
