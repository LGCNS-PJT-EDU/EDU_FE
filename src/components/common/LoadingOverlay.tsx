import { useLoadingStore } from "@/store/useLoadingStore";
import takeRabbit from "@/asset/img/common/takeRabbit.png";

export default function LoadingOverlay() {
  const { isLoading, message, imgSrc } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
      <img
        src={imgSrc ?? takeRabbit}
        alt="loading"
        className="mb-4 h-24 w-24 animate-bounce"
      />
      <p className="text-lg text-white">{message}</p>
    </div>
  );
}
