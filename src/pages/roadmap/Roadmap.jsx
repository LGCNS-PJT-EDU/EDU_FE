// src/components/Roadmap.jsx
import { useEffect, useState } from "react";
import SubjectModal from "./Subject";
import api from "../../api/axios"
import "../../styled/pages/roadmap.css";

/* 1) 설문 응답 mock 나중에 지울 예정 -------------------------------------- */
const answers = [
    { questionId: 1,  answer: "BE" },
    { questionId: 2,  answer: "2" },
    { questionId: 3,  answer: "3" },
    { questionId: 4,  answer: "Y" },
    { questionId: 11, answer: "Java/Spring" },
    { questionId: 12, answer: "Y" },
    { questionId: 13, answer: "Y" },
    { questionId: 14, answer: "Y" },
    { questionId: 15, answer: "N" },
  ];
  
  /* 2) 로드맵 요청 함수 -------------------------------------------------- */
  async function requestRoadmap(body) {
    console.log("[REQ] POST /api/roadmap/guest →", body);
    const res = await api.post("/api/roadmap/guest", body);
    console.log("[RES] roadmap data →", res.data);
    return res.data;
  }
  
  /* 3) 컴포넌트 ---------------------------------------------------------- */
  export default function Roadmap() {
    const [roadmap, setRoadmap]         = useState(null);              // 로드맵 전체
    const [selected, setSelected]       = useState(null);              // 모달 대상
    const [isModalOpen, setIsModalOpen] = useState(false);             // 모달 온/오프
    const [error, setError]             = useState("");                // 에러 메시지
  
    /* 3‑1) 마운트 → 로드맵 요청 */
    useEffect(() => {
      (async () => {
        try {
          const data = await requestRoadmap(answers);
          if (!data?.subjects?.length) {
            console.warn("subjects 배열이 비어 있습니다.");
          }
          setRoadmap(data);
        } catch (e) {
          console.error(e);
          setError("로드맵을 불러오지 못했습니다.");
        }
      })();
    }, []);
  
    /* 3‑2) 모달 열기 */
    const openModal = (subject) => {
      setSelected(subject);
      setIsModalOpen(true);
    };
  
    /* 4) 렌더링 ---------------------------------------------------------- */
    return (
      <section id="roadmap">
        <div className="container">
  
          {/* 헤더 */}
          <header className="header">
            <h1>맞춤 로드맵</h1>
          </header>
  
          {/* 에러 표시 */}
          {error && <p className="error-msg">{error}</p>}
  
          {/* subjects 존재하면 로드맵 그려주기 */}
          {roadmap?.subjects?.length > 0 && (
            <section className="visual">
              <div className="line" />
  
              <ul className="list">
                {roadmap.subjects
                  .map((s) => {
                    return (
                      <li key={s.subjectId} className="node">
                        <button
                          className="btn-subject"
                          onClick={() => openModal(s)}
                        >
                          {s.subjectName}
                        </button>
                      </li>
                    );
                  })}
              </ul>
            </section>
          )}
  
          {/* 모달 */}
          {isModalOpen && selected && (
            <SubjectModal
              subject={selected}
              onClose={() => setIsModalOpen(false)}
            />
          )}
  
        </div>
      </section>
    );
  }