import chevron from '@/asset/img/main/chevron-down.png';
import frontbubble from '@/asset/img/main/front_bubble.png';
import backbubble from '@/asset/img/main/back_bubble.png';

function Main() {
  return (
    <div
      className="h-[calc(100vh-70px)] flex justify-center items-center text-center font-[Figtree] text-[#373f41]"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #f3f5fd 40%, #6378eb 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-4">
        <p>
          방향을 잃고 헤매고 있나요?
          <br />
          진단 한 번으로 당신의 성장 경로가 눈앞에 펼쳐집니다.
          <br />
          쉽고 빠르게, 당신만의 로드맵을 만나보세요!
        </p>

        <div className="flex gap-3">
          <button className="btn-type">
            <img src={frontbubble} alt="frontbubble" />
          </button>
          <button className="btn-type">
            <img src={backbubble} alt="backbubble" />
          </button>
        </div>

        <div className="bg-[#98a0a1cc] px-6 py-3 rounded-full">
          <p className="text-xs text-[#f3f5fd]">🕐 진단 소요시간: 약 1분, 약 10문제</p>
        </div>

        <div className="bg-[#f3f5fd] border-2 border-[#6378eb] rounded-[20px] px-4 py-2 font-bold text-lg text-[#6378eb] transition-all hover:bg-[#6378eb] hover:text-white">
          <button className="text-xl font-bold bg-transparent border-none cursor-pointer hover:text-white text-[#6378eb]">Get Start</button>
        </div>

        <div className="text-2xl mt-2 animate-bounce">
          <img src={chevron} alt="takeit" className='mx-auto'/>
        </div>
      </div>
    </div>
  );
}
export default Main;
