# 아키텍처

이 프로젝트는 v0에서 생성한 산출물을 로컬 워크스페이스로 옮겨 둔 Next.js 블로그 애플리케이션입니다. App Router, TypeScript, React 19, Tailwind CSS 4, shadcn 스타일의 UI 컴포넌트 구성을 사용합니다.

## 최상위 구조

- `app/`: Next.js App Router 기반 라우트, 레이아웃, 전역 스타일을 포함합니다.
- `components/`: 재사용 가능한 애플리케이션 컴포넌트와 UI 프리미티브를 포함합니다.
- `content/posts/`: 블로그 포스트 원본 Markdown 파일을 저장합니다.
- `hooks/`: 공용 React 훅을 저장합니다.
- `lib/`: 서버 사이드 및 공용 유틸리티 로직을 포함합니다.
- `public/`: Next.js가 정적으로 서빙하는 이미지와 아이콘 같은 정적 자산을 저장합니다.
- `styles/`: v0 스캐폴드에서 유지된 추가 전역 스타일시트가 있습니다.
- `memory-bank/`: 이후 에이전트 세션에서 참고할 프로젝트 맥락 문서를 저장합니다.

## 라우팅

- `app/layout.tsx`: 루트 문서 셸, 테마 프로바이더 연결, 전역 메타데이터를 정의합니다.
- `app/page.tsx`: 블로그 홈 페이지입니다. 주요 포스트 목록 화면을 렌더링합니다.
- `app/posts/[slug]/page.tsx`: 포스트 상세 페이지를 위한 동적 라우트입니다. Markdown 콘텐츠 디렉터리에서 slug에 맞는 포스트를 찾아 렌더링합니다.

## 콘텐츠 모델

블로그 포스트는 `content/posts/` 안의 Markdown 파일로 관리합니다.

콘텐츠 처리의 중심은 `lib/posts.ts`입니다. 이 파일은 디스크에서 Markdown 파일을 읽고, `gray-matter`로 frontmatter를 파싱하며, 포스트 메타데이터를 만들고, 포스트 목록 조회와 개별 포스트 조회 헬퍼를 제공합니다.

현재 포함된 샘플 포스트는 다음과 같습니다.

- `building-rest-apis.md`
- `getting-started-with-nextjs.md`
- `react-state-management.md`
- `typescript-best-practices.md`

## 컴포넌트

애플리케이션 레벨 컴포넌트:

- `components/header.tsx`: 사이트 헤더와 내비게이션 영역입니다.
- `components/post-list.tsx`: 홈 페이지의 포스트 목록을 렌더링합니다.
- `components/post-card.tsx`: 개별 포스트 요약 카드를 렌더링합니다.
- `components/related-posts.tsx`: 포스트 상세 페이지의 관련 포스트 영역입니다.
- `components/theme-provider.tsx`: 테마 프로바이더 래퍼입니다.
- `components/theme-toggle.tsx`: 테마 전환 UI입니다.

UI 프리미티브는 `components/ui/` 아래에 있습니다. 버튼, 다이얼로그, 카드, 폼, 드롭다운 메뉴, 탭, 툴팁, 토스트 등 shadcn/Radix 스타일의 기반 컴포넌트들이 포함되어 있습니다.

## 스타일링

- `app/globals.css`: App Router에서 사용하는 기본 전역 스타일시트입니다.
- `styles/globals.css`: 스캐폴드에서 유지된 추가 전역 스타일시트입니다.
- `components.json`: 로컬 컴포넌트 시스템의 alias와 스타일 규칙을 설정합니다.
- Tailwind CSS 4는 `postcss.config.mjs`와 패키지 의존성을 통해 구성되어 있습니다.

## 유틸리티와 훅

- `lib/utils.ts`: class name 병합을 포함한 공용 유틸리티를 제공합니다.
- `hooks/use-mobile.ts`, `components/ui/use-mobile.tsx`: 반응형 viewport 관련 헬퍼입니다.
- `hooks/use-toast.ts`, `components/ui/use-toast.ts`: toast 상태와 호환성 유틸리티를 제공합니다.

## 빌드와 실행

`package.json`의 주요 스크립트:

- `npm run dev`: Next.js 개발 서버를 실행합니다.
- `npm run build`: 프로덕션 빌드를 수행합니다.
- `npm run start`: 빌드된 프로덕션 서버를 실행합니다.
- `npm run lint`: 프로젝트에 ESLint를 실행합니다.

프로젝트에는 원래 `pnpm-lock.yaml`이 포함되어 있습니다. 다만 로컬 서버 실행 과정에서 WSL 환경의 pnpm/Corepack 문제가 있어 `npm install`을 사용했고, 그 결과 `package-lock.json`과 실행 가능한 `node_modules` 트리가 생성되었습니다.

## 현재 로컬 메모

- 개발 서버는 `http://localhost:3000`에서 정상 응답하는 것을 확인했습니다.
- 이 프로젝트 실행에는 Docker가 필요하지 않습니다.
- Next.js 개발 서버 시작 과정에서 `next-env.d.ts`가 생성되었고 `tsconfig.json`이 자동 보정되었습니다.
