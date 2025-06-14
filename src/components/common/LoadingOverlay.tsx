import { useLoadingStore } from "@/store/useLoadingStore";
import takeRabbit from "@/asset/img/common/takeRabbit.png";
import { createPortal } from "react-dom";

export default function LoadingOverlay() {
  const { isLoading, message, imgSrc } = useLoadingStore();
  if (!isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm">
      <div className="absolute top-1/2 left-1/2
                      -translate-x-1/2 -translate-y-1/2
                      flex flex-col items-center">
        <img
          src={imgSrc ?? takeRabbit}
          alt="loading"
          className="mb-4 h-30 w-24 animate-spin"
        />
        <p className="text-lg text-white">{message}</p>
      </div>
    </div>,
    document.body,
  );
}