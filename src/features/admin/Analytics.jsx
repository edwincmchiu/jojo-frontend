import { useState, useEffect } from 'react';
import {
  BarChart, Bar, PieChart, Pie, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import {
  fetchEventsByType,
  fetchGroupParticipation,
  fetchUserActivity,
  fetchCapacityStats
} from '../../api/admin';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

export default function Analytics() {
  const [eventsByType, setEventsByType] = useState([]);
  const [groupData, setGroupData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [capacityData, setCapacityData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 日期篩選
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activityDays, setActivityDays] = useState(30);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [types, groups, activity, capacity] = await Promise.all([
      fetchEventsByType(startDate, endDate),
      fetchGroupParticipation(),
      fetchUserActivity(activityDays),
      fetchCapacityStats()
    ]);
    
    setEventsByType(types);
    setGroupData(groups);
    setActivityData(activity);
    setCapacityData(capacity);
    setLoading(false);
  };

  const handleRefresh = () => {
    loadData();
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">載入分析資料中...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-800">數據分析</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
        >
          🔄 重新整理
        </button>
      </div>

      {/* 日期篩選器 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">開始日期</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">結束日期</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">活躍度天數</label>
            <select
              value={activityDays}
              onChange={(e) => setActivityDays(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            >
              <option value="7">最近 7 天</option>
              <option value="30">最近 30 天</option>
              <option value="90">最近 90 天</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="mt-4 w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition"
        >
          套用篩選
        </button>
      </div>

      {/* 圖表區域 */}
      <div className="space-y-6">
        
        {/* 活動類型分布 - 長條圖 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 活動類型分布（長條圖）</h3>
          {eventsByType.length === 0 ? (
            <div className="text-center py-10 text-gray-400">暫無資料</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventsByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="event_count" fill="#3B82F6" name="活動數量" />
                <Bar dataKey="unique_hosts" fill="#10B981" name="主辦人數" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 活動類型佔比 - 圓餅圖 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🥧 活動類型佔比（圓餅圖）</h3>
          {eventsByType.length === 0 ? (
            <div className="text-center py-10 text-gray-400">暫無資料</div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={eventsByType}
                  dataKey="event_count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(entry) => `${entry.type} (${entry.event_count})`}
                >
                  {eventsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 群組參與度分析 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">👥 群組參與度分析</h3>
          {groupData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">暫無資料</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={groupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="group_name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="event_count" fill="#8B5CF6" name="活動數量" />
                <Bar dataKey="member_count" fill="#EC4899" name="成員數" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 使用者活躍度趨勢 - 折線圖 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📈 使用者活躍度趨勢（最近 {activityDays} 天）</h3>
          {activityData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">暫無資料</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activityData.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="active_users" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="活躍使用者"
                />
                <Line 
                  type="monotone" 
                  dataKey="total_joins" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="總報名數"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 活動填滿率 Top 20 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 活動填滿率 Top 20</h3>
          {capacityData.length === 0 ? (
            <div className="text-center py-10 text-gray-400">暫無資料</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">排名</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">活動名稱</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">類型</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">容量</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">報名數</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">填滿率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {capacityData.map((item, index) => (
                    <tr key={item.event_id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                          index === 0 ? 'bg-yellow-400 text-gray-900' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          index === 2 ? 'bg-orange-400 text-white' :
                          'bg-gray-200 text-gray-700'
                        }`}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.title}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                          {item.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.capacity}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.current_participants}</td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                parseFloat(item.fill_rate) >= 80 ? 'bg-green-500' :
                                parseFloat(item.fill_rate) >= 50 ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(parseFloat(item.fill_rate), 100)}%` }}
                            />
                          </div>
                          <span className="font-medium text-gray-700 min-w-[60px]">
                            {item.fill_rate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 統計摘要 */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-4">📋 統計摘要</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm opacity-90">活動類型數</div>
              <div className="text-3xl font-bold">{eventsByType.length}</div>
            </div>
            <div>
              <div className="text-sm opacity-90">活躍群組數</div>
              <div className="text-3xl font-bold">{groupData.length}</div>
            </div>
            <div>
              <div className="text-sm opacity-90">最高填滿率</div>
              <div className="text-3xl font-bold">
                {capacityData.length > 0 ? `${capacityData[0].fill_rate}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
