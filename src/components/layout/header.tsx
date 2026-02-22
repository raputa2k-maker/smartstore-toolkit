export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              스마트스토어 올인원 기획 도구
            </h1>
            <p className="text-sm text-muted-foreground">
              SEO 최적화 상품명 생성 + AI 상세페이지 기획안 자동 작성
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
