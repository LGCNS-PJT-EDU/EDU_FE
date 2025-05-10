import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SubjectModal from "@/pages/roadmap/Subject";
import "@/styled/pages/roadmap.css";

interface Answer {
  questionId: number;
  answer: string;
}

interface Subject {
  subjectId: number;
  subjectName: string;
}

interface RoadmapData {
  subjects: Subject[];
}

export default function Roadmap() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(
  state ?? null
  );  
  const [selected, setSelected] = useState<Subject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const subjects = roadmap?.subjects ?? [];

  useEffect(() => {
    if (!roadmap) {
      alert("로드맵 정보가 없습니다. 진단을 먼저 진행해 주세요.");
      navigate("/diagnosis", { replace: true });
    }
  }, [roadmap, navigate]);
  
    /* 3‑2) 모달 열기 */
    const openModal = (subject: Subject) => {
      setSelected(subject);
      setIsModalOpen(true);
    };

    return (
    <section id="roadmap">
      <div className="container">
        <header className="header">
          <h1>맞춤 로드맵</h1>
        </header>

        {subjects.length > 0 && (
          <section className="visual">
            <div className="line" />
            <ul className="list">
              {subjects.map((s) => (
                <li key={s.subjectId} className="node">
                  <button className="btn-subject" onClick={() => openModal(s)}>
                    {s.subjectName}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

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