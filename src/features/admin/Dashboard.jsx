import { useState, useEffect } from 'react';
import { fetchOverview, fetchTopHosts } from '../../api/admin';

export default function Dashboard() {
  const [overview, setOverview] = useState(null);
  const [topHosts, setTopHosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [overviewData, hostsData] = await Promise.all([
      fetchOverview(),
      fetchTopHosts()
    ]);
    setOverview(overviewData);
    setTopHosts(hostsData);
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">載入中...</div>;
  }

  if (!overview) {
    return <div className="text-center py-10 text-red-500">無法載入資料</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">儀表板總覽</h2>

      {/* 統計卡片區 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* 總使用者數 */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">👥</div>
            <div className="text-right">
              <div className="text-sm opacity-90">總使用者數</div>
              <div className="text-4xl font-bold">{overview.totalUsers}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            本月活躍：{overview.thisMonthActiveUsers} 人
          </div>
        </div>

        {/* 總活動數 */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">📅</div>
            <div className="text-right">
              <div className="text-sm opacity-90">總活動數</div>
              <div className="text-4xl font-bold">{overview.totalEvents}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            本月新增：{overview.thisMonthEvents} 個
          </div>
        </div>

        {/* 總參與次數 */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">🎉</div>
            <div className="text-right">
              <div className="text-sm opacity-90">總參與次數</div>
              <div className="text-4xl font-bold">{overview.totalParticipations}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            平均每活動：{overview.totalEvents > 0 ? (overview.totalParticipations / overview.totalEvents).toFixed(1) : 0} 人
          </div>
        </div>

        {/* 總群組數 */}
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">🏢</div>
            <div className="text-right">
              <div className="text-sm opacity-90">總群組數</div>
              <div className="text-4xl font-bold">{overview.totalGroups}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            限定群組活動：{overview.groupEvents || 0} 個 ({overview.totalEvents > 0 ? ((overview.groupEvents / overview.totalEvents) * 100).toFixed(1) : 0}%)
          </div>
        </div>

        {/* 平均活動容量 */}
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">📊</div>
            <div className="text-right">
              <div className="text-sm opacity-90">平均參與率</div>
              <div className="text-4xl font-bold">
                {overview.avgParticipationRate?.toFixed(1) || 0}%
              </div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            {overview.totalParticipations} / {overview.totalCapacity} 人
          </div>
        </div>

        {/* 本月成長 */}
        <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="text-5xl opacity-80">📈</div>
            <div className="text-right">
              <div className="text-sm opacity-90">本月成長</div>
              <div className="text-4xl font-bold">+{overview.thisMonthEvents}</div>
            </div>
          </div>
          <div className="text-sm opacity-90">
            活躍使用者：{overview.thisMonthActiveUsers} 人
          </div>
        </div>
      </div>

      {/* 熱門主辦者排行榜 */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">🏆 熱門主辦者排行榜</h3>
          <span className="text-sm text-gray-500">Top 10</span>
        </div>

        {topHosts.length === 0 ? (
          <div className="text-center py-8 text-gray-400">暫無資料</div>
        ) : (
          <div className="space-y-3">
            {topHosts.map((host, index) => (
              <div 
                key={host.user_id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 ? 'bg-yellow-400 text-gray-900' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-400' :
                    'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{host.name}</div>
                    <div className="text-sm text-gray-500">
                      ID: {host.user_id}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-800">
                    {host.events_hosted}
                  </div>
                  <div className="text-xs text-gray-500">
                    {host.total_participants} 參與者
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
