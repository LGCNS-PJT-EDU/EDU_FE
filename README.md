# LGCNS_InspireCamp_Education

## 🧠 **AI 기반 초개인화 개발자 진로 추천 및 학습 전략 서비스 요약**

### 🔍 서비스 개요

- **대상:** 진입 단계의 전공자/비전공자 & 주니어 개발자
- **목표:** 성향과 기술 수준에 따라 맞춤형 커리어 경로와 학습 전략 제공
- **차별점:** 단순 커리큘럼 추천이 아닌, AI가 "왜 이걸 배워야 하는지"를 설명하고 피드백해주는 **코칭형 초개인화 학습**

## 🛠 메인 라이브러리

| 분류               | 라이브러리                   | 설명                                                 |
| :----------------- | :--------------------------- | :--------------------------------------------------- |
| 프레임워크/빌드 툴 | React 18, Vite               | UI 라이브러리 + 번들러/개발서버                      |
| 스타일링           | Styled-CSS, shadcn/ui        | 유틸리티 기반 CSS 프레임워크, UI 컴포넌트 라이브러리 |
| 상태 관리          | Redux Toolkit, Zustand       | 전역 상태 관리 라이브러리                            |
| 데이터 통신        | React Query, Axios           | 서버 상태 관리(캐싱, 동기화) + HTTP 요청 라이브러리  |
| API Mocking        | Mock Service Worker (MSW)    | API 요청을 가짜(Mock)로 시뮬레이션하는 툴            |
| 시각화             | Chart.js                     | 데이터 시각화를 위한 차트 라이브러리                 |
| 라우팅             | React Router DOM             | SPA 내 페이지 라우팅을 관리하는 라이브러리           |
| 인증 (OAuth)       | OAuth (Google, Kakao, Naver) | 소셜 로그인 인증 구현 (직접 OAuth 연동)              |

## 📂 디렉토리 구조

```
src/
├── api/                       # Axios, react-query 등 API 호출
│   └── axios.tsx
│
├── components/               # 재사용 가능한 UI 컴포넌트
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Nav.tsx
│   └── styles/               # 관련된 CSS
│       ├── footer.css
│       ├── nav.css
│       └── ...
│
├── layout/                   # 전체 레이아웃 컴포넌트
│   └── MainLayout.tsx
│
├── model/                    # 인터페이스/타입 정의
│   └── user.tsx
│
├── pages/                    # 페이지 단위 구성
│   ├── login/
│   │   ├── Login.tsx
│   │   └── login.tsx
│   ├── signup/
│   │   ├── Signup.tsx
│   │   └── signup.tsx
│   ├── Main.tsx
│   ├── About.tsx
│   └── Contact.tsx
│
├── store/                    # Zustand, Redux 관련 전역 상태
│   └── userStore.tsx
│
├── styles/                   # Tailwind 설정 or 글로벌 스타일
│   └── index.css
│
├── App.jsx
├── main.jsx
```

## ✨ 커밋 메시지 컨벤션

git commit -m "✨feat(jira이슈번호): 커밋내용"

| 타입       | 설명                                            |
| :--------- | ----------------------------------------------- |
| ✨feat     | 새로운 기능 추가                                |
| 🐛fix      | 버그 수정                                       |
| 📝docs     | 문서 수정                                       |
| 💄style    | 공백, 세미콜론 등 스타일 수정                   |
| ♻️refactor | 코드 리팩토링                                   |
| ⚡️perf    | 성능 개선                                       |
| ✅test     | 테스트 추가                                     |
| 👷chore    | 빌드 과정 또는 보조 기능(문서 생성기능 등) 수정 |

- Subject:
  커밋의 작업 내용 간략히 설명

### PR 타입(하나 이상의 PR 타입을 선택해주세요)

## 🎉 title

| 타입       | 설명                                            |
| :--------- | ----------------------------------------------- |
| ✨feat     | 새로운 기능 추가                                |
| 🐛fix      | 버그 수정                                       |
| 📝docs     | 문서 수정                                       |
| 💄style    | 공백, 세미콜론 등 스타일 수정                   |
| ♻️refactor | 코드 리팩토링                                   |
| ⚡️perf    | 성능 개선                                       |
| ✅test     | 테스트 추가                                     |
| 👷chore    | 빌드 과정 또는 보조 기능(문서 생성기능 등) 수정 |

### 📌 반영 브랜치

ex) feat/login -> dev

### 🛠️ 변경 사항

ex) 로그인 시, 구글 소셜 로그인 기능을 추가했습니다.

### ✅ 테스트 결과

ex) 베이스 브랜치에 포함되기 위한 코드는 모두 정상적으로 동작해야 합니다. 결과물에 대한 스크린샷, GIF, 혹은 라이브 데모가 가능하도록 샘플API를 첨부할 수도 있습니다.
자동으로 PR 템플릿 지정하는 방법

- Body:
  길게 설명할 필요가 있을 시 작성

- Footer:
  Breaking Point 가 있을 때
  특정 이슈에 대한 해결 작업일 때

- Body:
  길게 설명할 필요가 있을 시 작성

- Footer:
  Breaking Point 가 있을 때
  특정 이슈에 대한 해결 작업일 때

- [Gitmoji](https://gitmoji.dev/)를 이용하여 Type을 대신하기도 합니다.
