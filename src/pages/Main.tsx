import chevron from '@/asset/img/main/chevron-down.png';
import frontbubble from '@/asset/img/main/front_bubble.png';
import backbubble from '@/asset/img/main/back_bubble.png';
import startBtn from '@/asset/img/main/BTN style 1.png';
import { Link } from 'react-router-dom';

function Main() {
  return (
    <div
      className="h-[calc(100vh-70px)] flex justify-center items-center text-center font-[Figtree] text-[#373f41]"
      style={{
        background: 'linear-gradient(to bottom, #ffffff 0%, #C6EDF2 100%)',
      }}
    >
      <div className="flex flex-col items-center gap-4 font-[NeoDunggeunmo] pt-12">
        <p className='text-xl'>
          방향을 잃고 헤매고 있나요?
          <br />
          진단 한 번으로 당신의 성장 경로가 눈앞에 펼쳐집니다.
          <br />
          쉽고 빠르게, 당신만의 로드맵을 만나보세요!
        </p>

        <div className=" px-6 py-5 rounded-full">
          <p className="text-s text-[#5E5E5E]">🕐 진단 소요시간: 약 7분, 약 20문제</p>
        </div>

        <Link to="/diagnosis" className="mt-[20px]">
          <button className="text-lg bg-transparent border-none cursor-pointer font-['Press_Start_2P'] text-[#fff]">
            <img src={startBtn} alt="startBtn" className='w-[167px]' />
          </button>
        </Link>

        <div className="relative w-[200px] h-[120px] mx-auto">

            <div className="absolute top-0 left-0 z-10 btn-type cursor-pointer">
              <img src={backbubble} alt="BackEnd" />
            </div>


          {/* FrontEnd 말풍선 */}
          <button className="absolute bottom-5 z-10 btn-type cursor-pointer">
            <img src={frontbubble} alt="FrontEnd" className="w-[120px]" />
          </button>
        </div>

        <div className="text-2xl mt-10 animate-bounce">
          <img src={chevron} alt="takeit" className='mx-auto' />
        </div>
      </div>
    </div>
  );
}
export default Main;
