import '@/styled/pages/main.css'
import chevron from '@/asset/img/main/chevron-down.png'
import frontbubble from '@/asset/img/main/front_bubble.png'
import backbubble from '@/asset/img/main/back_bubble.png'
function Main() {
  return (
    <div className='mainpage'>
      <div className="content">
        <p>방향을 잃고 헤매고 있나요?<br />
          진단 한 번으로 당신의 성장 경로가 눈앞에 펼쳐집니다.<br />
          쉽고 빠르게, 당신만의 로드맵을 만나보세요!</p>

        <div className="btn-group">
          <button className="btn-type">
            <img src={frontbubble} alt="frontbubble" />
          </button>
          <button className="btn-type">
            <img src={backbubble} alt="backbubble" />
          </button>
        </div>

        <div className='subtext-main'>
          <p className="subtext">🕐 진단 소요시간: 약 1분, 약 10문제</p>
        </div>
        <div className='getstart'>
          <button className="get-start">Get Start</button>
        </div>

        <div className="arrow">
          <img src={chevron} alt="takeit" />
        </div>
      </div>
    </div>
  )
}
export default Main;