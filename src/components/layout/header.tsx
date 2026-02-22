export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            S
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              스마트스토어 SEO 상품명 생성기
            </h1>
            <p className="text-sm text-muted-foreground">
              네이버 쇼핑 검색 최적화 가이드라인 기반 AI 상품명 추천
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
