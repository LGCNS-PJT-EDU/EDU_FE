import { useEffect, useState } from 'react';
import '@/styled/pages/subject.css';
import api from '@/api/axios';

export interface SubjectRef {
  subjectId: number;
  subjectName: string;
}

interface Video {
  title: string;
  url: string;
}

interface Chapter {
  chapterName: string;
  chapterOrder: number;
}

interface SubjectDetail {
  subjectId: number;
  overview: string;
  videos: Video[];
  chapters: Chapter[];
}

interface SubjectModalProps {
  subject: SubjectRef;
  onClose: () => void;
}

interface ApiRecommendContent {
  contentName: string;
  url: string;
  contentType: string;
}

interface ApiSubjectResponse {
  subject_name: string;
  subject_overview: string;
  chapters: Chapter[];
  preSubmitCount: number;
  postSubmitCount: number;
  recommendContents: ApiRecommendContent[];
}

async function fetchSubjectDetail(subjectId: number): Promise<SubjectDetail> {
  try {
    const { data } = await api.get<ApiSubjectResponse>('/api/roadmap/subject', {
      params: { subjectId },
    });

    return {
      subjectId,
      overview: data.subject_overview,
      videos: data.recommendContents.map((c) => ({
        title: c.contentName,
        url: c.url,
      })),
      chapters: data.chapters,
    };
  } catch (err) {
    console.error('fetchSubjectDetail error:', err);
    throw err;
  }
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
              <ol className="chapter-list">
                {detail.chapters
                  .sort((a, b) => a.chapterOrder - b.chapterOrder)
                  .map((ch) => (
                    <li key={ch.chapterOrder}>{ch.chapterName}</li>
                  ))}
              </ol>
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
            <button className="action" onClick={() => alert('사전평가 화면으로 이동 예정')}>
              사전평가 보러가기
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
