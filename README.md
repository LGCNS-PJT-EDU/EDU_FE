# LGCNS_InspireCamp_Education

## 🧠 **AI 기반 초개인화 개발자 진로 추천 및 학습 전략 서비스 요약**

### 🔍 서비스 개요

- **대상:** 진입 단계의 전공자/비전공자 & 주니어 개발자
- **목표:** 성향과 기술 수준에 따라 맞춤형 커리어 경로와 학습 전략 제공
- **차별점:** 단순 커리큘럼 추천이 아닌, AI가 "왜 이걸 배워야 하는지"를 설명하고 피드백해주는 **코칭형 초개인화 학습**

## 🛠 메인 라이브러리

- React 18 + Vite
- TailwindCSS

- shadcn/ui
- Redux Toolkit
- Zustand
- React Query
- Axios
- Mock Service Worker (MSW)
- Chart.js
- React Router DOM
- OAuth (Google, Kakao, Naver)

## 📂 디렉토리 구조

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

