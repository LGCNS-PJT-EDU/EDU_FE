import { useEffect, useState } from "react"
import './about.css'

function About() {
	const [show, setShow] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.screenY;
			const windowHeight = window.innerHeight;
			if (scrollY > windowHeight * 0.5) {
				setShow(true);
			}else{
				setShow(false);
			}
		};
		window.addEventListener("scroll",handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	},[])

	return (
		<section id="about">
			<div className="container">
				<h1>About</h1>
				<header className={`hero ${show ? "visible" : ""}`}>
					<h1>당신의 개발 여정, AI가 함께 설계합니다.</h1>
					<p>넘쳐나는 정보 속에서, 나만을 위한 맞춤형 커리어 전략을 제공합니다.</p>
				</header>

				<section className="why">
					<h2>Why? — 왜 필요한가요</h2>
					<p>기존 커리큘럼은 모두에게 똑같습니다.
						그러나 사람마다 성향과 실력은 다릅니다.
						우리는 단순 추천을 넘어,
						<strong>"왜 이걸 배워야 하는지"</strong>까지 설명하는 초개인화 코칭을 제공합니다.</p>
				</section>

				<section className="how">
					<h2>How? — 어떻게 다를까요</h2>
					<ul>
						<li><strong>성향 분석:</strong> 개발 성향과 관심 분야를 파악합니다.</li>
						<li><strong>기술 진단:</strong> 현재 실력 수준을 진단합니다.</li>
						<li><strong>맞춤 추천:</strong> 성장 단계에 맞춘 로드맵을 제공합니다.</li>
						<li><strong>학습 코칭:</strong> 각 추천의 이유를 구체적으로 설명합니다.</li>
						<li><strong>지속 피드백:</strong> 학습 진행 상황에 따라 전략을 수정합니다.</li>
					</ul>
				</section>

				<section className="for-whom">
					<h2>For Whom? — 이런 분께 추천해요</h2>
					<ul>
						<li>개발을 처음 시작하는 전공자/비전공자</li>
						<li>방향성을 잡고 싶은 주니어 개발자</li>
						<li>단순 강의 추천이 아닌 진짜 코칭을 원하는 분</li>
					</ul>
				</section>

				<section className="service-glance">
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
								<td>성향과 기술 수준을 고려한 맞춤 추천</td>
							</tr>
							<tr>
								<td>🛤 커리어 로드맵 제공</td>
								<td>단계별 맞춤 성장 전략 제시</td>
							</tr>
							<tr>
								<td>🧠 학습 이유 설명</td>
								<td>각 추천에 대한 명확한 코칭</td>
							</tr>
							<tr>
								<td>🔄 지속적 피드백 루프</td>
								<td>학습 진단 → 추천 → 피드백 반복</td>
							</tr>
						</tbody>
					</table>
				</section>

				<section className="cta">
					<h2>Ready?</h2>
					<p>지금, 당신만을 위한 개발 여정을 시작해보세요.</p>
					<button className="start-button">시작하기</button>
				</section>
			</div>
		</section>
	)
}
export default About