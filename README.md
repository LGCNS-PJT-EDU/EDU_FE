# LGCNS_InspireCamp_Education

## 🧠 **AI 기반 초개인화 개발자 진로 추천 및 학습 전략 서비스 요약**

### 🔍 서비스 개요

- **대상:** 진입 단계의 전공자/비전공자 & 주니어 개발자
- **목표:** 성향과 기술 수준에 따라 맞춤형 커리어 경로와 학습 전략 제공
- **차별점:** 단순 커리큘럼 추천이 아닌, AI가 "왜 이걸 배워야 하는지"를 설명하고 피드백해주는 **코칭형 초개인화 학습**

## 🛠 메인 라이브러리

| 분류 | 라이브러리 | 설명 |
| :--- | :--- | :--- |
| 프레임워크/빌드 툴 | React 18, Vite | UI 라이브러리 + 번들러/개발서버 |
| 스타일링 | TailwindCSS, shadcn/ui | 유틸리티 기반 CSS 프레임워크, UI 컴포넌트 라이브러리 |
| 상태 관리 | Redux Toolkit, Zustand | 전역 상태 관리 라이브러리 |
| 데이터 통신 | React Query, Axios | 서버 상태 관리(캐싱, 동기화) + HTTP 요청 라이브러리 |
| API Mocking | Mock Service Worker (MSW) | API 요청을 가짜(Mock)로 시뮬레이션하는 툴 |
| 시각화 | Chart.js | 데이터 시각화를 위한 차트 라이브러리 |
| 라우팅 | React Router DOM | SPA 내 페이지 라우팅을 관리하는 라이브러리 |
| 인증 (OAuth) | OAuth (Google, Kakao, Naver) | 소셜 로그인 인증 구현 (직접 OAuth 연동) |


## 📂 디렉토리 구조
```
src/
├── api/                # Axios + React Query API 호출 정리
├── assets/             # 이미지, 폰트, 글로벌 스타일
├── components/         # 재사용 가능한 UI 컴포넌트
├── constants/          # 상수 값 (API URL, 에러 메시지 등)
├── hooks/              # 커스텀 훅 모음
├── layouts/            # 공통 레이아웃 컴포넌트
├── models/             # 타입, 인터페이스 정의
├── pages/              # 페이지 컴포넌트
├── routes/             # 라우터 설정
├── store/              # Zustand, Redux 상태 관리
├── styles/             # Tailwind 설정, 글로벌 스타일
├── mocks/              # Mock 데이터 및 MSW 핸들러
└── utils/              # 유틸 함수
```
# ✨ 커밋 메시지 컨벤션

| 타입 | 설명 |
| :- | - |
| ✨feat | 새로운 기능 추가 |  
| 🐛fix | 버그 수정 |  
| 📝docs | 문서 수정 |  
| 💄style | 공백, 세미콜론 등 스타일 수정 |  
| ♻️refactor | 코드 리팩토링 |  
| ⚡️perf | 성능 개선 | 
| ✅test | 테스트 추가 | 
| 👷chore | 빌드 과정 또는 보조 기능(문서 생성기능 등) 수정 | 

* Subject: 
커밋의 작업 내용 간략히 설명

* Body: 
길게 설명할 필요가 있을 시 작성

* Footer: 
Breaking Point 가 있을 때
특정 이슈에 대한 해결 작업일 때

* [Gitmoji](https://gitmoji.dev/)를 이용하여 Type을 대신하기도 합니다.

