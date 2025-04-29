import '../styled/mypage.css';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try{
      await axios.delete('/api/user/signout');
      alert('로그아웃 되었습니다.')
      navigate('/')
    }catch(error) {
      console.error('로그아웃 실패', error);
      alert('문제발생')
    }
  }
  return (
    <section id="articles">

      <section className="mypage-header">
        <h1>MyPage</h1>
        <button className="feedbackBtn">피드백 보기</button>
      </section>


      {/* 상태 툴바 */}
      <section class="mypage-container">
        <div class="mypage-header">
          어디까지 완료했나요?
          <span class="mypage-count">2/10</span>
        </div>
        <div class="mypage-bar">
          <div class="mypage-fill"></div>
        </div>
      </section>

      {/* 즐겨찾기 */}
      <section className="Favorites">
        <div className="curriculum">
          <span className="labels">Book</span>
          <p className="names">모던 자바스크립트 Deep Dive</p>
        </div>
      </section>

      {/* 회원탈퇴, 로그아웃 */}
      <section className="mypage-footer">
        <button onClick={handleLogout} className="logoutBtn">로그아웃</button>
        <span>|</span>
        <button className='signout'>회원탈퇴</button>
      </section>
    </section>
  )
}
export default MyPage;