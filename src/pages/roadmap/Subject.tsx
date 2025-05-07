// src/components/Subject.jsx
import { useEffect, useState } from "react";
import "@/styled/pages/subject.css";

export interface SubjectRef {
  subjectId: number;
  subjectName: string;
}

interface Video {
  title: string;
  url: string;
}

interface SubjectDetail {
  subjectId: number;
  overview: string;
  videos: Video[];
}

interface SubjectModalProps {
  subject: SubjectRef;
  onClose: () => void;
}

async function fetchSubjectDetail(subjectId: number): Promise<SubjectDetail> {
  // TODO: 실제 API 연동 시 교체
  await new Promise((r) => setTimeout(r, 300));

  return {
    subjectId,
    overview: "이 과목은 개발자가 반드시 알아야 할 기본 리눅스 명령어를 다룹니다.",
    videos: [
      {
        title: "1시간에 끝내는 Linux 기본 명령어",
        url: "https://www.youtube.com/watch?v=ymwMfvzAOPg&list=PL8oUjFBfGVJxH_oJkYfRwSqM9Q5Fy5C1X",
      },
      {
        title: "생활코딩 - 리눅스(Linux)",
        url: "https://edu.goorm.io/lecture/12984/%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9-%EB%A6%AC%EB%88%85%EC%8A%A4-linux",
      },
    ],
  };
}

export default function SubjectModal({ subject, onClose }: SubjectModalProps) {
  const [detail, setDetail] = useState<SubjectDetail | null>(null);

  useEffect(() => {
    (async () => {
      const d = await fetchSubjectDetail(subject.subjectId);
      setDetail(d);
    })();
  }, [subject.subjectId]);

  return (
    <section id="subject-modal">
      <div className="overlay">
        <div className="card">
          <button className="close" onClick={onClose}>
            &times;
          </button>

          <h3 className="title">{subject.subjectName}</h3>

          {detail ? (
            <div className="body">
              <p className="overview">{detail.overview}</p>

              <h4 className="subtitle">추천 강의</h4>
              <ul className="video-list">
                {detail.videos.map((v) => (
                  <li key={v.title}>
                    <a
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link"
                    >
                      {v.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="loading">로딩 중...</p>
          )}

          <div className="footer">
            <button
              className="action"
              onClick={() => alert("사전평가 화면으로 이동 예정")}
            >
              사전평가 보러가기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}