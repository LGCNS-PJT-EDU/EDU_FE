import { useEffect, useState } from 'react';
import '@/styled/pages/subject.css';
import { useSubjectDetail } from '@/hooks/useSubjectDetail';
import { useNavigate } from 'react-router-dom';

export interface SubjectRef {
  subjectId: number;
  subjectName: string;
}

interface SubjectModalProps {
  subject: SubjectRef;
  onClose: () => void;
}

export default function SubjectModal({ subject, onClose }: SubjectModalProps) {
  const navigate = useNavigate();
  
  const {
    data: detail,
    isLoading,
    isError,
  } = useSubjectDetail(subject.subjectId);

  return (
    <div id='subject-modal'>
      <div className="overlay">
        <div className="card">
          <button className="close" onClick={onClose}>
            &times;
          </button>

          <h3 className="title">{subject.subjectName}</h3>

          {isLoading ? (
            <p className="loading">로딩 중...</p>
          ) : isError || !detail ? (
            <p className="loading">과목 정보를 불러오는 데 실패했습니다.</p>
          ) : (
            <div className="body">
              <p className="overview">{detail.overview.replace(/([.!?])\s*/g, '$1\n')}</p>

              <ol className="chapter-list">
                {detail.chapters
                  .sort((a, b) => a.chapterOrder - b.chapterOrder)
                  .map((chapter) => (
                    <li key={chapter.chapterOrder}>{chapter.chapterName}</li>
                  ))}
              </ol>

              <h4 className="subtitle">추천 강의</h4>
              <ul className="video-list">
                {detail.videos.map((video) => (
                  <li key={video.title}>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="video-link"
                    >
                      {video.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="footer">
            <button
              className="action"
              onClick={() =>
                navigate(`/diagnosis/prete`)
              }
            >
              사전평가 보러가기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
