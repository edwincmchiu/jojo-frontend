import { useState, useEffect } from 'react';
import { fetchAllEvents, deleteEvent } from '../../api/admin';

export default function EventManager() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await fetchAllEvents();
    setEvents(data);
    setLoading(false);
  };

  const handleDelete = async (eventId, eventTitle) => {
    if (!window.confirm(`確定要刪除活動「${eventTitle}」嗎？\n此操作將同時刪除所有報名紀錄。`)) {
      return;
    }

    try {
      await deleteEvent(eventId);
      alert('刪除成功！');
      loadEvents();
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return '未定';
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  // 取得所有活動類型
  const allTypes = ['all', ...new Set(events.map(e => e.Type_name))];

  // 篩選活動
  const filteredEvents = events.filter(event => {
    const matchSearch = event.Title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       event.Content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || event.Type_name === filterType;
    return matchSearch && matchType;
  });

  if (loading) {
    return <div className="text-center py-10 text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">活動管理</h2>

      {/* 搜尋與篩選區域 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋活動標題或內容"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
          >
            <option value="all">所有類型</option>
            {allTypes.filter(t => t !== 'all').map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 統計資訊 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-800">{events.length}</div>
            <div className="text-sm text-gray-500 mt-1">總活動數</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {events.reduce((sum, e) => sum + parseInt(e.participant_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">總參與人次</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {events.filter(e => e.Group_id).length}
            </div>
            <div className="text-sm text-gray-500 mt-1">限定群組活動</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {new Set(events.map(e => e.Type_name)).size}
            </div>
            <div className="text-sm text-gray-500 mt-1">活動類型數</div>
          </div>
        </div>
      </div>

      {/* 列表區域 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">活動列表</h3>
          <p className="text-sm text-gray-500 mt-1">
            顯示 {filteredEvents.length} / {events.length} 個活動
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredEvents.map((event) => (
            <div key={event.Event_id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-800 text-lg">{event.Title}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                      {event.Type_name}
                    </span>
                    {event.Group_id && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded">
                        🔒 {event.group_name || '限定群組'}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-2">{event.Content}</p>
                  
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>👤 主辦：{event.owner_name || '已刪除'}</span>
                    <span>📅 {formatDate(event.Start_time)}</span>
                    <span>👥 {event.participant_count} / {event.Capacity} 人</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleDelete(event.Event_id, event.Title)}
                  className="ml-4 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}

          {filteredEvents.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              {searchTerm || filterType !== 'all' ? '找不到符合的活動' : '目前沒有活動'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
