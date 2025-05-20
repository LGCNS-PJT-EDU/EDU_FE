import { useEffect, useRef } from 'react';

function About() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        });
      },
      { threshold: 0.3 } // 30% 보이면 등장 시작
    );

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => {
      sectionsRef.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  const setRef = (el: HTMLElement | null, index: number) => {
    sectionsRef.current[index] = el;
  };

  return (
    <section className="scroll-snap-y scroll-snap-mandatory">
      <div className="w-[90%] max-w-[1200px] mx-auto">
        <section className="text-center py-10">
          <h1 className="text-4xl font-bold">About</h1>
        </section>

        {[
          {
            title: '당신의 개발 여정, AI가 함께 설계합니다.',
            desc: '넘쳐나는 정보 속에서, 나만을 위한 맞춤형 커리어 전략을 제공합니다.',
          },
          {
            title: 'Why? — 왜 필요한가요',
            desc: '기존 커리큘럼은 모두에게 동일합니다. 그러나 사람마다 성향과 실력은 다릅니다. 우리는 단순 추천을 넘어, "왜 이걸 배워야 하는지"까지 설명합니다.',
          },
        ].map((item, idx) => (
          <section
            key={idx}
            ref={(el) => setRef(el, idx + 1)}
            className="h-screen flex flex-col justify-center items-center scroll-snap-start px-8 opacity-0 translate-y-24 transition-all duration-1000"
          >
            <h2 className="text-2xl font-semibold text-center mb-4">{item.title}</h2>
            <p className="text-center max-w-3xl">{item.desc}</p>
          </section>
        ))}

        <section
          ref={(el) => setRef(el, 3)}
          className="h-screen flex flex-col justify-center items-center scroll-snap-start px-8 opacity-0 translate-y-24 transition-all duration-1000"
        >
          <h2 className="text-2xl font-semibold mb-4">How? — 어떻게 다를까요</h2>
          <ul className="list-disc space-y-2 text-left max-w-xl">
            <li>
              <strong>성향 분석:</strong> 개발 성향과 관심 분야 파악
            </li>
            <li>
              <strong>기술 진단:</strong> 현재 실력 수준 진단
            </li>
            <li>
              <strong>맞춤 추천:</strong> 성장 단계별 로드맵 제공
            </li>
            <li>
              <strong>학습 코칭:</strong> 학습 이유 구체적 설명
            </li>
            <li>
              <strong>지속 피드백:</strong> 학습 진단 → 추천 → 피드백 반복
            </li>
          </ul>
        </section>

        <section
          ref={(el) => setRef(el, 4)}
          className="h-screen flex flex-col justify-center items-center scroll-snap-start px-8 opacity-0 translate-y-24 transition-all duration-1000"
        >
          <h2 className="text-2xl font-semibold mb-4">For Whom? — 이런 분께 추천해요</h2>
          <ul className="list-disc space-y-2 text-left max-w-xl">
            <li>개발을 처음 시작하는 전공자/비전공자</li>
            <li>방향성을 잡고 싶은 주니어 개발자</li>
            <li>단순 강의 추천이 아닌 진짜 코칭을 원하는 분</li>
          </ul>
        </section>

        <section
          ref={(el) => setRef(el, 5)}
          className="h-screen flex flex-col justify-center items-center scroll-snap-start px-8 opacity-0 translate-y-24 transition-all duration-1000"
        >
          <h2 className="text-2xl font-semibold mb-4">Service at a Glance</h2>
          <table className="w-4/5 mt-5 border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-3 font-bold">특징</th>
                <th className="border border-gray-300 p-3 font-bold">설명</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['🎯 초개인화 분석', '성향과 기술 수준 고려한 맞춤 추천'],
                ['🛤 커리어 로드맵 제공', '단계별 성장 전략 제공'],
                ['🧠 학습 이유 설명', '추천 기술의 학습 이유 설명'],
                ['🔄 지속적 피드백', '학습 진단 → 추천 → 피드백 반복'],
              ].map(([feature, desc], idx) => (
                <tr key={idx} className="hover:bg-gray-100">
                  <td className="border border-gray-300 p-3 text-center">{feature}</td>
                  <td className="border border-gray-300 p-3 text-center">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section
          ref={(el) => setRef(el, 6)}
          className="h-screen flex flex-col justify-center items-center scroll-snap-start px-8 opacity-0 translate-y-24 transition-all duration-1000"
        >
          <h2 className="text-2xl font-semibold mb-4">Ready?</h2>
          <p>지금, 당신만을 위한 개발 여정을 시작해보세요.</p>
          <button className="mt-5 px-6 py-2 text-white text-lg bg-blue-600 hover:bg-blue-800 rounded-lg transition-colors">
            시작하기
          </button>
        </section>
      </div>
    </section>
  );
}

export default About;
