import useLogout from '@/hooks/useLogout';
import { useState } from 'react';
import { useProgress } from '@/hooks/useProgress';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type TabType = 'favorite' | 'report';

function MyPage() {
  const logout = useLogout();
  const [activeTab, setActiveTab] = useState<TabType>('favorite');
  const { data: progressData, isLoading: isProgressLoading } = useProgress();
  const percent = Math.min(100, Math.round((progressData?.percent || 0)));

  return (
    <div className="flex flex-col min-h-screen font-[pretendard]">
      <div className="flex-grow px-4">
        {/* 헤더 */}
        <div className="w-full flex justify-between items-center mb-6 mt-10">
          <h1 className="text-2xl font-bold">마이페이지</h1>
        </div>

        {/* 상태 툴바 */}
        <div className="w-full mb-13">
          <div className="mb-4 text-[20px] font-medium">
            {progressData?.nickname}님, 어디까지 학습을 진행하셨나요?
            <span className="ml-2 font-bold">{percent}%</span>
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#6378EB] rounded-l-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* 탭 nav */}
        <div className="inline-flex rounded-lg bg-[#f3f6fb] p-1 mb-5">
          <button
            onClick={() => setActiveTab('favorite')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'favorite'
                ? 'bg-white text-gray-900 font-semibold shadow-sm'
                : 'text-gray-500'
              }`}
          >
            추천 콘텐츠
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`px-4 py-2 text-sm rounded-md transition-all ${activeTab === 'report'
                ? 'bg-white text-gray-900 font-semibold shadow-sm'
                : 'text-gray-500'
              }`}
          >
            평가 리포트
          </button>
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'favorite' ? (
          <div className="Favorites">
            <Card className="w-full max-w-md shadow-md">
              <CardHeader>
                <CardTitle>생활코딩-HTML</CardTitle>
                <CardDescription>HTML</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">강의</h3>
                    <a
                      href="https://www.youtube.com/watch?v=tZooW6PritE&list=PLuHgQVnccGMDZP7FJ_ZsUrdCGH68ppvPb&ab_channel=%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline break-all"
                    >
                      링크
                    </a>
                  </div>
                  <div>
                    <h3 className="font-semibold mt-2 text-gray-800">type</h3>
                    <p>동영상</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mt-2 text-gray-800">platform</h3>
                    <p>유튜브</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mt-2 text-gray-800">level</h3>
                    <p>하</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mt-2 text-gray-800">price</h3>
                    <p>무료</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="report">
            <Card className="w-full max-w-md shadow-md">
              <CardHeader>
                <CardTitle>HTML</CardTitle>
                <CardDescription>나의 평가를 확인해보세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <div>
                    <h3 className="font-semibold text-gray-800">평가리포트</h3>
                    <p>평가리포트 페이지로 이동하기</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {/* 회원탈퇴, 로그아웃 */}
      <div className="mt-auto w-full py-4 text-center">
        <button onClick={logout} className="mr-2">
          로그아웃
        </button>
        <span className="mx-2">|</span>
        <button className="ml-2">회원탈퇴</button>
      </div>
    </div>
  );
}

export default MyPage;