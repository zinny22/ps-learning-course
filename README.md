# PS Learning Course

알고리즘 문제 풀이(PS)를 **주차별 로드맵 + 문제 은행 + 노트/코드 기록** 형태로 관리하는 개인용 학습 코스 웹앱입니다.
React + Vite + TypeScript + Tailwind CSS + Zustand 기반으로 만들었습니다.

## 주요 기능

- **학습 코스(홈)**: 전체 진행 상황 요약, 로드맵 개요, 학습 원칙/가이드
- **주차별 계획(Weeks)**: 주차 목표/학습 포인트/체크리스트/대표 사고방식 기반 로드맵
- **문제 은행(Problems)**: 전체 문제 리스트 + 검색/필터
- **문제 상세 페이지**:
  - 풀이 메모를 마크다운으로 기록 (보기/편집 모드)
  - 코드 작성(에디터) + 코드 보기(하이라이트/라인번호/복사)
  - PDF 출력(브라우저 인쇄) 친화 UI
- **진도 관리**:
  - 문제 상태: TODO / DONE / RETRY
  - 주차/전체 진행률 표시
  - LocalStorage에 자동 저장(Zustand persist)

## 기술 스택

- **Framework**: React + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS (+ `clsx`, `tailwind-merge`)
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **State**: Zustand (`persist` 미들웨어로 로컬 저장)

## 프로젝트 구조

```
src/
├── app/          # App configuration (routes)
├── components/   # Shared UI components (Button, Card, Layout, etc.)
├── data/         # Static data (curriculum, problems)
├── features/     # Feature-specific components (WeekCard, ProblemCard)
├── lib/          # Utilities
├── pages/        # Page components
├── stores/       # Global state stores (Zustand)
└── types.ts      # TypeScript interfaces
```

## 시작하기

### 1) 설치

```bash
npm install
```

### 2) 개발 서버 실행

```bash
npm run dev
```

### 3) 프로덕션 빌드

```bash
npm run build
```

## 사용 가이드(간단)

- **학습 코스(홈)**에서 전체 로드맵과 진행 상태를 확인합니다.
- **주차별 계획**에서 해당 주차의 목표/체크리스트/문제 목록을 따라가며 학습합니다.
- **문제 은행**에서 원하는 문제를 검색하고, 각 문제의 상태를 변경하며 관리합니다.
- **문제 상세**에서 풀이 메모/코드를 기록하고, 필요하면 PDF로 출력합니다.
