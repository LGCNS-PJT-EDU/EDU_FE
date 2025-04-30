import '../styled/feedback.css';
import RadarChart from '../components/RadarChart';

function Feedback() {
  return (
    <section id="articles">
      {/* 메인 타이틀 */}
      <section className="heuristic">
        <h2 className="section-title">Education Evalution</h2>
        <p className="subtitle">TakeIT과 함께한 학습 여정, 이제 더 나은 방향을 향해 나아갑니다.</p>
        <p className="subtitle-en">We’ve wrapped up the evaluation phase to prepare for what’s next.</p>
      </section>

      {/* 레이더 차트 */}
      <section className="radar-chart">
        <RadarChart />
      </section>

      {/* 피드백 테이블 */}
      <section className="heuristic-table">
        {/* 헤더 */}
        <div className="table-header">
          <div></div>
          <div>학습용이성<br /><span>Learnability</span></div>
          <div>효율성<br /><span>Efficiency</span></div>
          <div>유용성<br /><span>Usefulness</span></div>
          <div>호감도/재미<br /><span>Likability/fun</span></div>
          <div>심미성<br /><span>Aesthetics</span></div>
        </div>

        {/* 장점 */}
        <div className="good-feedback">
          <div>😊</div>
          <div>복잡한 과정을 단계별로 정리해 처음 사용자도 이해하기 쉬웠다.</div>
          <div>단계별 흐름이 명확하고 기능 간 이동이 직관적이다.</div>
          <div>다양한 정보들이 한눈에 들어오고 필요한 정보에 빠르게 접근할 수 있었다.</div>
          <div>마이크로 인터랙션이 재미있게 느껴졌고 전반적으로 지루하지 않았다.</div>
          <div>컬러와 타이포그래피 조화가 좋았고 구성도 깔끔했다.</div>
        </div>

        {/* 단점 */}
        <div className="bad-feedback">
          <div>😐</div>
          <div>처음 보는 메뉴 명칭이 생소하고 기능이 명확하지 않아 어려움이 있었다.</div>
          <div>정보가 많아 중요한 요소를 찾는 데 시간이 걸렸다.</div>
          <div>특정 기능이 어디에 있는지 찾기 어려웠다.</div>
          <div>시각적인 피드백이 부족해서 흥미가 떨어졌다.</div>
          <div>텍스트가 많고 정보가 산만하게 느껴졌다.</div>
        </div>
      </section>
    </section>
  );
}

export default Feedback;
