# TakeIT FE

### ❗ 이런 고민, 해본 적 있지 않나요?

공부는 열심히 했는데 실력은 늘지 않는 것 같고,  
다음에 뭘 해야 할지 몰라서 발만 동동 구르게 되는 순간들.

> 📌 학습자들의 실제 고민  
> - "HTML 끝났는데 다음은 뭘 공부해야 하죠?"  
> - "CS는 언젠가 해야 된다던데, 도대체 언제?"  
> - "나 실력이 안 되는 걸까? 아니면 방법이 문제일까..."

학습자들은 다양한 플랫폼에서 공부하지만  
무엇을 얼마나, 어떤 순서로 해야 할지 **객관적인 기준이 부족합니다.**

---

### 🧱 기존 서비스로는 부족했던 이유

- 🧩 **표면적인 진단만 제공**  
  - 객관식 위주의 진단으로 실무 감각이나 논리 구조 파악이 어렵습니다.  

- 🧠 **AI 피드백의 신뢰성 부족**  
  - 단순 점수 혹은 키워드 기반으로만 작동해, 실질적인 개선 방향 제시는 부족합니다.  

- 🕰 **성장 과정이 기록되지 않음**  
  - 내가 어떤 과정을 거쳐 어떻게 성장했는지 확인할 수 없습니다.  

- 📚 **획일적인 커리큘럼**  
  - 누구에게나 똑같은 순서와 콘텐츠를 제시해 개인화된 학습은 어렵습니다.


---

### 🚀 TakeIT의 해결책 – 성장 루트를 제시하는 AI 기반 학습 플랫폼

그래서 TakeIT은 다음과 같은 **통합 학습 성장 시스템**을 만들었습니다:

1. **사전 진단**  
   → 사용자의 현재 수준을 분석하고  
2. **맞춤 로드맵 생성**  
   → 성향과 실력에 맞는 개발 학습 경로를 제시  
3. **콘텐츠 추천 & 학습 진행**  
   → 강의, 블로그, 실습 콘텐츠 자동 큐레이션  
4. **사후 진단**  
   → 서술형 기반 성과 측정 + 성장 피드백  
5. **AI 면접 & 피드백**  
   → STT 기반 녹음 → GPT 기반 서술형 피드백 제공  

---

### 🧠 무엇이 다른가요?

- 🎯 GPT 기반 서술형 피드백  
  → 단순 점수가 아닌, **왜 부족했는지**, **어떻게 보완할 수 있는지** 알려줍니다.

- 🎙 STT 기반 면접 연습 + TTS 질문 읽기  
  → 말하기 실력까지 성장 추적 가능, 녹음 내역이 성장 히스토리가 됩니다.

- 📊 학습 히스토리 및 성과 시각화  
  → 나의 진단 결과, 로드맵 진행률, 사후 성과를 하나의 흐름으로 확인 가능

- 🧩 개인화된 성장 루트 제시  
  → 사용자 한 명 한 명에게 **당신만의 성장 경로**를 제공합니다.

---

> ✨ TakeIT은 '공부하는 방법'까지 안내하는 플랫폼을 만듭니다.

<br/>

## 🚀 주요 기능

### 🧭 퍼스널 러닝 학습 여정 추천
- **나에게 맞는 개발자 로드맵 제공**  
  - 사용자의 성향과 실력을 바탕으로 학습 로드맵을 자동 구성  
  - 로드맵 진행률과 단계별 완료 상태를 시각적으로 제공  

- **로드맵 맞춤 진단 및 수정 기능**  
  - 선호하는 기술, 경험, 목표를 기반으로 로드맵을 수정/보완 가능

---

### 📚 AI 기반 콘텐츠 추천
- **진단 기반 학습 콘텐츠 추천**  
  - 유튜브 강의, 블로그, 도서 콘텐츠를 진단 결과에 따라 자동 추천  
  - "바로가기" 버튼을 통해 콘텐츠로 즉시 이동 가능  

---

### 📈 평가 결과 기반 성장 분석
- **사전/사후 평가 시스템**  
  - 학습 전후 실력 변화를 점수와 레이더 차트로 시각화  

- **심층 피드백 제공**  
  - 기술별 강점 및 약점을 분석하고 학습 가이드를 텍스트로 제공  
  - 학습 방향을 제시하여 자기 주도 학습 유도  

---

### 🧠 AI 면접 피드백 기능

- **STT/TTS 활용한 면접 연습**  
  - 면접 질문을 TTS(Text-to-Speech) 기술로 음성 출력
  - 사용자는 마이크로 음성으로 답변하고, STT(Speech-to-Text) 기술로 자동 텍스트 변환
 
    
- **AI 음성 인터뷰 및 피드백 제공**  
  - 면접 질문에 대한 음성 녹음을 기반으로 AI가 피드백 제공  
  - 논리성, 키워드 포함 여부 등을 자동 분석  



<br/>


## 🖼️ 메인 라이브러리

| 분류               | 라이브러리                   | 설명                                                 |
| :----------------- | :--------------------------- | :--------------------------------------------------- |
| 프레임워크/빌드 툴 | React 18, Vite               | UI 라이브러리 + 번들러/개발서버                      |
| 스타일링           | Tailwind, shadcn/ui          | 유틸리티 기반 CSS 프레임워크, UI 컴포넌트 라이브러리 |
| 상태 관리          | Redux Toolkit, Zustand       | 전역 상태 관리 라이브러리                            |
| 데이터 통신        | React Query, Axios           | 서버 상태 관리(캐싱, 동기화) + HTTP 요청 라이브러리  |
| API Mocking        | Mock Service Worker (MSW)    | API 요청을 가짜(Mock)로 시뮬레이션하는 툴            |
| 시각화             | Chart.js                     | 데이터 시각화를 위한 차트 라이브러리                 |
| 라우팅             | React Router DOM             | SPA 내 페이지 라우팅을 관리하는 라이브러리           |
| 인증 (OAuth)       | OAuth (Google, Kakao, Naver) | 소셜 로그인 인증 구현 (직접 OAuth 연동)              |

<br/>

## 🛠 기술 스택

### 🔹 핵심 기술
![React](https://img.shields.io/badge/React%2018-61DAFB?style=flat&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)

### ⚙️ 개발 환경
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

### 🎨 UI 컴포넌트 및 디자인
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-black?style=flat)
![framer-motion](https://img.shields.io/badge/framer--motion-0055FF?style=flat&logo=framer&logoColor=white)

### 📦 상태 관리 및 API 통신
![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat&logo=zustand&logoColor=white)
![React Query](https://img.shields.io/badge/React%20Query-FF4154?style=flat&logo=react-query&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat)

### 📝 폼 관리 및 검증
![react-hook-form](https://img.shields.io/badge/react--hook--form-EC5990?style=flat)
![zod](https://img.shields.io/badge/zod-3E61E9?style=flat)

### 🔀 페이지 라우팅
![React Router](https://img.shields.io/badge/React%20Router-CA4245?style=flat&logo=reactrouter&logoColor=white)

### 📊 시각화
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![react-chartjs-2](https://img.shields.io/badge/react--chartjs--2-FFCE56?style=flat)

### 🧩 기타 인터랙션 및 시각 요소
![react-dnd](https://img.shields.io/badge/react--dnd-FFC107?style=flat)
![OGL](https://img.shields.io/badge/OGL-000000?style=flat)
![react-icons](https://img.shields.io/badge/react--icons-E91E63?style=flat)
![lucide-react](https://img.shields.io/badge/lucide--react-5C5CFF?style=flat)

### ✅ 코드 품질 및 린팅
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=white)
![Husky](https://img.shields.io/badge/Husky-000000?style=flat)

### 🧪 테스트
![Vitest](https://img.shields.io/badge/Vitest-6E9F18?style=flat)
![Playwright](https://img.shields.io/badge/Playwright-45BA63?style=flat)


## 📂 디렉토리 구조

```
src/
├── api/             # Axios 인스턴스 및 서비스 모듈
├── components/      # 공통 UI, 모달, 차트 등
├── hooks/           # React Query와 상태 관련 커스텀 훅
├── pages/           # 라우트별 페이지 컴포넌트
├── store/           # Zustand 기반 전역 상태
├── route/           # React Router 설정
├── lib/             # 유틸리티 함수
├── asset/           # 정적 리소스
├── types/           # 타입 정의
├── index.css        # Tailwind 전역 스타일
├── App.tsx          # 앱 최상위 컴포넌트
└── main.tsx         # React DOM 렌더링 진입점

```
