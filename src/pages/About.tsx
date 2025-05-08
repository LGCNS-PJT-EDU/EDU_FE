import { useEffect, useRef } from "react";
import '@/styled/pages/about.css'

function About() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.3 } // 30% 보이면 등장 시작
    );

    sectionsRef.current.forEach(section => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach(section => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const setRef = (el: HTMLElement | null, index: number) => {
    sectionsRef.current[index] = el;
  };

  return (
    <section id="articles">
      <div className="container">

        <section className="header">
          <h1>About</h1>
        </section>

        <section ref={el => setRef(el, 1)} className="section">
          <h1>당신의 개발 여정, AI가 함께 설계합니다.</h1>
          <p>넘쳐나는 정보 속에서, 나만을 위한 맞춤형 커리어 전략을 제공합니다.</p>
        </section>

        <section ref={el => setRef(el, 2)} className="section">
          <h2>Why? — 왜 필요한가요</h2>
          <p>기존 커리큘럼은 모두에게 동일합니다. 그러나 사람마다 성향과 실력은 다릅니다. 우리는 단순 추천을 넘어, <strong>"왜 이걸 배워야 하는지"</strong>까지 설명합니다.</p>
        </section>

        <section ref={el => setRef(el, 3)} className="section">
          <h2>How? — 어떻게 다를까요</h2>
          <ul>
            <li><strong>성향 분석:</strong> 개발 성향과 관심 분야 파악</li>
            <li><strong>기술 진단:</strong> 현재 실력 수준 진단</li>
            <li><strong>맞춤 추천:</strong> 성장 단계별 로드맵 제공</li>
            <li><strong>학습 코칭:</strong> 학습 이유 구체적 설명</li>
            <li><strong>지속 피드백:</strong> 학습 진단 → 추천 → 피드백 반복</li>
          </ul>
        </section>

        <section ref={el => setRef(el, 4)} className="section">
          <h2>For Whom? — 이런 분께 추천해요</h2>
          <ul>
            <li>개발을 처음 시작하는 전공자/비전공자</li>
            <li>방향성을 잡고 싶은 주니어 개발자</li>
            <li>단순 강의 추천이 아닌 진짜 코칭을 원하는 분</li>
          </ul>
        </section>

        <section ref={el => setRef(el, 5)} className="section">
          <h2>Service at a Glance</h2>
          <table>
            <thead>
              <tr>
                <th>특징</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>🎯 초개인화 분석</td>
                <td>성향과 기술 수준 고려한 맞춤 추천</td>
              </tr>
              <tr>
                <td>🛤 커리어 로드맵 제공</td>
                <td>단계별 성장 전략 제공</td>
              </tr>
              <tr>
                <td>🧠 학습 이유 설명</td>
                <td>추천 기술의 학습 이유 설명</td>
              </tr>
              <tr>
                <td>🔄 지속적 피드백</td>
                <td>학습 진단 → 추천 → 피드백 반복</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section ref={el => setRef(el, 6)} className="section">
          <h2>Ready?</h2>
          <p>지금, 당신만을 위한 개발 여정을 시작해보세요.</p>
          <button className="start-button">시작하기</button>
        </section>

      </div>
    </section>
  );
}

export default About;
