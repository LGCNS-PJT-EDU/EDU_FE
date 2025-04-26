# LGCNS_InspireCamp_Education

## 🧠 **AI 기반 초개인화 개발자 진로 추천 및 학습 전략 서비스 요약**

### 🔍 서비스 개요

- **대상:** 진입 단계의 전공자/비전공자 & 주니어 개발자
- **목표:** 성향과 기술 수준에 따라 맞춤형 커리어 경로와 학습 전략 제공
- **차별점:** 단순 커리큘럼 추천이 아닌, AI가 "왜 이걸 배워야 하는지"를 설명하고 피드백해주는 **코칭형 초개인화 학습**

# 🛠 메인 라이브러리

## 📂 디렉토 구조
src/
│
├── api/              # Axios, react-query 요청 정리
├── assets/           # 이미지, 폰트, 글로벌 스타일 (Tailwind 설정 파일 등)
├── components/       # 재사용 가능한 UI 컴포넌트 (Button, Card 등)
├── constants/        # 상수 파일 (API URL, 에러 메시지, OAuth 설정 값 등)
├── hooks/            # 커스텀 훅 (useUser, useDebounce 등)
├── layouts/          # 페이지 레이아웃 (MainLayout, AuthLayout)
├── models/           # 데이터 타입, 인터페이스 정의 (User, Post, AuthResponse)
├── pages/            # 페이지 컴포넌트 (Home, Login, Profile 등)
├── routes/           # 라우터 설정 파일 (react-router-dom v6 기준)
├── store/            # Zustand/Redux 전역 상태 관리
├── styles/           # Tailwind 설정 확장, 전역 CSS (shadcn 확장도 여기)
├── utils/            # 유틸 함수 모음 (formatDate, validateEmail 등)
├── mocks/            # Mock Service Worker 관련 파일 (mock 데이터, 핸들러 등)
└── index.tsx         # 진입 파일



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

---
