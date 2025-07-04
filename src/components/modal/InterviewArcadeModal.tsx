import { useEffect, useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function InterviewArcadeModal({ open, onClose }: Props) {
  const arcadeIframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function onArcadeIframeMessage(e: MessageEvent) {
      if (e.origin !== "https://demo.arcade.software" || !e.isTrusted) return;
      if (e.data.event === "arcade-popout-close") {
        onClose();
      }
    }
    window.addEventListener("message", onArcadeIframeMessage);
    return () => window.removeEventListener("message", onArcadeIframeMessage);
  }, [onClose]);

  if (!open) return null;

  return (
    <div
      style={{
        zIndex: 99999,
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.70)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <iframe
        ref={arcadeIframeRef}
        src="https://demo.arcade.software/J0nNFcryyai44iHzwWDT?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="원하는 면접 과목 선택하고 인터뷰 시작하기"
        frameBorder="0"
        allowFullScreen
        allow="clipboard-write"
        loading="lazy"
        style={{
          width: "75vw",
          height: "75vh",
          borderRadius: "20px",
          background: "#fff",
        }}
        onClick={(e) => e.stopPropagation()} // iframe 클릭 시 모달 닫히지 않게
      />
      {/* 닫기 버튼 */}
      <button
        style={{
          position: "absolute",
          top: 32,
          right: 32,
          zIndex: 100000,
          background: "rgba(255,255,255,0.9)",
          border: "none",
          borderRadius: "9999px",
          width: 40,
          height: 40,
          fontSize: 24,
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
}
