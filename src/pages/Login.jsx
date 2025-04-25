import './login.css'
import kakaoIcon from '../../public/asset/btn_kakao.svg'
import NaverIcon from '../../public/asset/btn_naver.svg'
import GoogleIcon from '../../public/asset/btn_google.svg'
function Login(){
    return(
        <div className="loginMain">
            <img src="public/asset/takeRabbit.png" alt="rabbit"/>
            <p className="subtitle">개발자, 지금 TakeIT와 함께 시작해보세요</p>
            <div className="start">
                <p>3초만에 시작하기🎉</p>
            </div>
            <div className="sociallogin">
            <button className="kakao">
                    <img src={kakaoIcon} alt="카카오 로그인" />
                </button>
                <button className="naver">
                    <img src={NaverIcon} alt="네이버 로그인" />
                </button>
                <button className="google">
                    <img src={GoogleIcon} alt="구글 로그인" />
                </button>
            </div>
            <div class="links">
                <a href="#">회원가입</a>
                <span>|</span>
                <a href="#">문항보기</a>
            </div>
        </div>
    )
}
export default Login
