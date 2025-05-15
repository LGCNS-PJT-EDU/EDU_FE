import html from "@/asset/img/roadmap/subject/HTML.png";                  // 1
import css from "@/asset/img/roadmap/subject/CSS.png";                    // 2
import javascript from "@/asset/img/roadmap/subject/JavaScript.png";      // 3
import typescript from "@/asset/img/roadmap/subject/TypeScript.png";      // 4
import virtualDOM from "@/asset/img/roadmap/subject/VirtualDOM.jpeg";     // 5
import git from "@/asset/img/roadmap/subject/Git.png";                    // 6 · 37
import gitHook from "@/asset/img/roadmap/subject/GitHook.jpeg";           // 7 · 38
import axiosInstance from "@/asset/img/roadmap/subject/AxiosInstance.png";// 8
import restAPI from "@/asset/img/roadmap/subject/RestAPI.png";            // 9
import react from "@/asset/img/roadmap/subject/React.png";                // 10 · 23 · 24 · 33 · 34
import redux from "@/asset/img/roadmap/subject/Redux.png";                // 11
import zustand from "@/asset/img/roadmap/subject/Zustand.jpeg";           // 12
import vue from "@/asset/img/roadmap/subject/Vue.png";                    // 13
import vuex from "@/asset/img/roadmap/subject/Vuex.jpeg";                 // 14
import angular from "@/asset/img/roadmap/subject/Angular.png";            // 15
import ngrx from "@/asset/img/roadmap/subject/NgRx.png";                  // 16
import storybook from "@/asset/img/roadmap/subject/Storybook.png";        // 17
import tailwind from "@/asset/img/roadmap/subject/Tailwind.png";          // 18
import scss from "@/asset/img/roadmap/subject/SCSS.svg";                  // 19
import styled from "@/asset/img/roadmap/subject/styled.jpeg";             // 20
import eslint from "@/asset/img/roadmap/subject/EsLint.png";              // 21
import nextjs from "@/asset/img/roadmap/subject/Nextjs.png";              // 22
import vueTest from "@/asset/img/roadmap/subject/VueTest.png";            // 25
import nuxtjs from "@/asset/img/roadmap/subject/Nuxtjs.png";              // 26
import angularUniversal from "@/asset/img/roadmap/subject/AngularUniversal.png"; // 27
import jasmine from "@/asset/img/roadmap/subject/Jasmine.png";            // 28
import webpack from "@/asset/img/roadmap/subject/Webpack.png";            // 29
import gitAction from "@/asset/img/roadmap/subject/GitAction.png";        // 30
import nginx from "@/asset/img/roadmap/subject/Nginx.png";                // 31
import awss3 from "@/asset/img/roadmap/subject/AWSS3.png";                // 32
import linux from "@/asset/img/roadmap/subject/Linux.jpeg";               // 35
import http from "@/asset/img/roadmap/subject/Http.png";                  // 36
import java from "@/asset/img/roadmap/subject/Java.png";                  // 39
import python from "@/asset/img/roadmap/subject/Python.jpeg";             // 40
import kotlin from "@/asset/img/roadmap/subject/Kotlin.jpeg";             // 42
import sql from "@/asset/img/roadmap/subject/SQL.png";                    // 43
import moreAboutDB from "@/asset/img/roadmap/subject/MoreAboutDB.png";    // 44
import scalingDB from "@/asset/img/roadmap/subject/ScalingDB.png";        // 45
import javaSpring from "@/asset/img/roadmap/subject/JavaSpring.png";      // 46 · 51 · 53
import nodejs from "@/asset/img/roadmap/subject/Nodejs.png";              // 47 · 54 · 55
import django from "@/asset/img/roadmap/subject/django.png";              // 48 · 56 · 57
import flask from "@/asset/img/roadmap/subject/Flask.png";                // 49 · 58 · 59
import kotlinSpring from "@/asset/img/roadmap/subject/KotlinSpring.jpeg"; // 50 · 52

export const SUBJECT_IMAGES: Record<string, string> = {
  // 1
  "HTML": html,

  // ２
  "CSS": css,

  // ３
  "JavaScript": javascript,

  // ４
  "TypeScript": typescript,

  // 5
  "Virtual DOM": virtualDOM,

  // 6
  "Git & GitHub": git,

  // 7
  "Git Hook (Husky, lint-staged) 자동화": gitHook,

  // 8
  "Axios 인스턴스 관리, 공통 인터셉터 구성": axiosInstance,

  // 9
  "REST API 기반 에러 처리 / 재시도 로직": restAPI,

  // 10
  "React": react,

  // 11
  "Redux": redux,

  // 12
  "Zustand": zustand,

  // 13
  "Vue": vue,

  // 14
  "Vuex & Pinia": vuex,

  // 15
  "Angular": angular,

  // 16
  "NgRx": ngrx,

  // 17
  "컴포넌트 디자인 시스템(Storybook)": storybook,

  // 18
  "Tailwind CSS": tailwind,

  // 19
  "SCSS": scss,

  // 20
  "styled": styled,

  // 21
  "EsLint & Prettier": eslint,

  // 22
  "Next.js": nextjs,

  // 23
  "React 렌더링 최적화 (React.memo, useMemo, useCallback)": react, // 🔸 TODO: 전용 아이콘 있으면 교체

  // 24
  "React Query 심화 (Prefetch, Query Keys, Invalidations)": react, // 🔸 TODO

  // 25
  "Vue Test Utils (Vue)": vueTest,

  // 26
  "Nuxt.js (Vue)": nuxtjs,

  // 27
  "Angular Universal (Angular SSR)": angularUniversal,

  // 28
  "Jasmine (Angular)": jasmine,

  // 29
  "Webpack 개념과 설정": webpack,

  // 30
  "GitHub Actions로 빌드/배포 자동화": gitAction,

  // 31
  "Dockerize된 프론트엔드 앱 배포 (Nginx 등)": nginx,

  // 32
  "AWS S3 + CloudFront 기반 SPA 배포": awss3,

  // 33
  "Unit Test, Snapshot Test, Integration Test": react, // 🔸 TODO

  // 34
  "E2E Test, Visual Regression Test": react, // 🔸 TODO

  // 35
  "리눅스 명령어": linux,

  // 36
  "HTTP, HTTPS, DNS, TCP/IP 기본 개념": http,

  // 37 (중복) ― 이미 6번에서 지정

  // 38 (중복) ― 이미 7번에서 지정

  // 39
  "Java": java,

  // 40
  "Python": python,

  // 41 (중복) ― 이미 3번에서 지정

  // 42
  "Kotlin": kotlin,

  // 43
  "SQL문": sql,

  // 44
  "More About Database(RDB 종류, NoSQL)": moreAboutDB,

  // 45
  "Scaling Databases(쿼리튜닝, 정규화)": scalingDB,

  // 46
  "Spring & Spring Boot(Java)": javaSpring,

  // 47
  "Node.js & Express.js": nodejs,

  // 48
  "Django": django,

  // 49
  "Flask": flask,

  // 50
  "Spring & Spring Boot(Kotlin)": kotlinSpring,

  // 51
  "Java + Spring 라이브러리 & 유틸": javaSpring,

  // 52
  "Kotlin + Spring 라이브러리 & 유틸": kotlinSpring,

  // 53
  "Java,Kotlin + Spring 운영 & 배포": javaSpring,

  // 54
  "Node.js 라이브러리 & 유틸": nodejs,

  // 55
  "Node.js 운영 & 배포": nodejs,

  // 56
  "Django 라이브러리 & 유틸": django,

  // 57
  "Django 운영 & 배포": django,

  // 58
  "Flask 라이브러리 & 유틸": flask,

  // 59
  "Flask 운영 & 배포": flask,
};
