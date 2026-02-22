# 작업 일지 — smartstore-toolkit

## 현재 상태
v2.1 UI 미니멀 모션 개선 완료 — 빌드 성공 + 브라우저 확인 완료

## 최근 변경 (2026-02-22)

### 프로젝트 확장: smart-store-seo → smartstore-toolkit
- 폴더명 리네이밍 완료
- 앱 이름: "스마트스토어 올인원 기획 도구"
- 기존 SEO 상품명 생성 기능 + 상세페이지 기획안 AI 생성 기능 통합

### 페이즈 시스템 구축
- 7단계 페이즈 진행 형식 구현 (Phase 0~6)
- React Context + useReducer 기반 중앙 상태 관리
- 설정 기반 확장 가능 구조 (phase-config.ts에 추가만 하면 새 페이즈 등록)

### 신규 파일 생성 (약 25개)
- types/phase.ts, types/detail-page.ts
- lib/phase/ (phase-config, phase-context, phase-store)
- hooks/ (use-phase, use-phase-store)
- components/phase/ (phase-container, phase-navigation, phase-progress)
- components/phases/ (settings, product-info, seo-names, seo-check)
- components/phases/detail-input-phase/ (index + section-tabs + s0~s9 폼 12개)
- components/phases/ (ai-generate-phase, preview-phase)
- lib/gemini/detail-prompt-builder.ts
- app/api/generate-detail/route.ts

### 수정된 기존 파일 (3개)
- app/page.tsx → PhaseProvider + PhaseContainer 래퍼
- app/layout.tsx → 메타데이터 변경
- components/layout/header.tsx → 앱 이름 변경

## 브라우저 E2E 검증 결과 (2026-02-22)

### Phase별 검증 완료
| Phase | 이름 | 결과 | 비고 |
|-------|------|------|------|
| 0 | 설정 | ✅ 통과 | 모델 선택, API 키, 저장 토글 |
| 1 | 상품 정보 | ✅ 통과 | 모든 폼 필드, 주문제작 토글 |
| 2 | 상품명 생성 | ✅ 통과 | 5개 추천, 선택 UI, 점수 배지 |
| 3 | SEO 검증 | ✅ 통과 | 자동 검사 6/6, 재검사 |
| 4 | 상세페이지 정보 | ✅ 통과 | 10개 탭 전환, S5 조건부 비활성 |
| 5 | 기획안 생성 | ✅ 통과 | 섹션 카드, CTA 배치, 재생성 |
| 6 | 미리보기 | ✅ 통과 | 마크다운, 복사/다운로드, SEO/모바일 노트 |

### Phase 전환 흐름
- Phase 0→1→2→3→4→5→6 순차 전환 정상
- 프로그레스 바: 완료 체크마크, 활성 강조, 잠금 표시 정상
- 가드 조건: Phase 2 (선택 필수), Phase 4 (메인카피 필수) 정상 동작
- "이전" 버튼 네비게이션 정상

### 확인된 UI 요소
- 반응형 프로그레스 바 (데스크톱: 원형 스텝퍼, 모바일: 세그먼트 바)
- 추천 카드 선택 UI (ring, 체크마크, "선택됨" 배지)
- 위반 사항 경고 (ViolationAlert, 노란색)
- 동적 배열 추가/삭제 (베네핏, FAQ 등)
- 카피라이팅 팁 (💡 아이콘), 디자인 노트 (🎨 아이콘)
- CTA 배치 카드 (섹션 위치 + 스타일 배지)

## 빌드 상태
- `npm run build` 성공 (TypeScript 에러 없음)
- 라우트: /, /api/generate, /api/generate-detail
- 개발 서버: `npx next dev --port 3001`

## UI 미니멀 모션 개선 (2026-02-22)

### 의존성 추가
- `framer-motion` 설치

### 신규 파일 4개 (src/components/motion/)
| 파일 | 역할 |
|------|------|
| `fade-in.tsx` | 방향별 fade+slide 래퍼 (up/down/left/right/none) |
| `stagger-container.tsx` | 리스트 카드 순차 등장 오케스트레이터 + staggerItemVariants |
| `phase-transition.tsx` | AnimatePresence 기반 Phase 전환 (slide-fade) |
| `skeleton-pulse.tsx` | 로딩용 스켈레톤 카드/라인 (shimmer 애니메이션) |

### 수정 파일 16개
**코어 Phase UI (3개)**
- `phase-container.tsx` — PhaseTransition 래퍼 (Phase 전환 slide-fade)
- `phase-progress.tsx` — motion.div 원형 스텝 (whileHover spring) + 커넥터 scaleX 애니메이션
- `phase-navigation.tsx` — Next 버튼 whileHover/whileTap scale

**핵심 Phase 컴포넌트 (5개)**
- `settings-phase.tsx` — 모델 선택 motion.button (whileHover/whileTap)
- `seo-names-phase.tsx` — SkeletonCard 로딩 + StaggerContainer 결과 + 선택 bounce
- `seo-check-phase.tsx` — FadeIn 검사 결과
- `ai-generate-phase.tsx` — SkeletonCard 로딩 + StaggerContainer 기획안 결과
- `preview-phase.tsx` — StaggerContainer 카드 순차 등장

**Detail Input Phase (5개)**
- `section-tabs.tsx` — layoutId 슬라이딩 pill 인디케이터
- `detail-input-phase/index.tsx` — AnimatePresence 섹션 전환 fade
- `s2-benefits-form.tsx` — AnimatePresence 항목 추가/삭제 slide
- `s7-faq-form.tsx` — AnimatePresence 항목 추가/삭제 slide
- `s6-reviews-form.tsx` — AnimatePresence 항목 추가/삭제 slide

**CSS 폴리시 (3개)**
- `header.tsx` — sticky + bg-white/80 backdrop-blur-sm + 미세 그림자
- `globals.css` — 카드 호버 shadow, 버튼 active scale(0.97), 인풋 포커스 전환
- `check-result.tsx` — 검사 결과 행 stagger 등장 (delay: idx * 0.06)

## 다음 할 일
- 추가 기능: 기획안 PDF 내보내기
- 추가 기능: 이미지 업로드 연동
- 실제 Gemini API 키로 E2E 통합 테스트
