// src/features/join-event/EventFeed.jsx

import { useState, useEffect } from 'react';
import { fetchEventFeed, joinEvent } from '../../api/feed';
import { fetchEventTypes, fetchGroups } from '../../api/admin';
import { trackClick } from '../../api/track';

// 輔助函式 (略，假設已在 feed.js 或 utils 中定義)
// const getIconByType = (type) => { ... }; 

export default function EventFeed() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 100;
  
  const [showRecommend, setShowRecommend] = useState(false);
  const [filterType, setFilterType] = useState('全部');
  const [filterGroup, setFilterGroup] = useState('all');

  const [activityTypes, setActivityTypes] = useState([{ value: "全部", label: "所有類型" }]);
  const [groupFilters, setGroupFilters] = useState([{ value: "all", label: "顯示所有活動" }]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [types, groups] = await Promise.all([
          fetchEventTypes(),
          fetchGroups()
        ]);
        
        const typeOptions = [
          { value: "全部", label: "所有類型" },
          ...types.map(t => ({ value: t.type_name, label: `${t.type_name}` }))
        ];
        setActivityTypes(typeOptions);
        
        const groupOptions = [
          { value: "all", label: "顯示所有活動" },
          ...groups.map(g => ({ value: String(g.group_id), label: `${g.name}` }))
        ];
        setGroupFilters(groupOptions);
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    };
    
    loadFilters();
  }, []);

  useEffect(() => {
    setLoading(true);
    
    if (showRecommend) {
      fetchEventFeed({ isRecommend: true }).then(data => {
        setEvents(data);
        setCurrentPage(1);
        setLoading(false);
      });
    } else {
      fetchEventFeed({
        type: filterType === '全部' ? null : filterType,
        groupId: filterGroup === 'all' ? null : filterGroup,
        isRecommend: false
      }).then(data => {
        setEvents(data);
        setCurrentPage(1);
        setLoading(false);
      });
    }
  }, [showRecommend, filterType, filterGroup]);

  const handleRecommendToggle = async () => {
    const nextState = !showRecommend;
    setShowRecommend(nextState);

    // Only track when the user turns ON the recommendation
    if (nextState) {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user && user.id) {
                await trackClick({ userId: user.id });
            }
        } catch (error) {
            console.error('Failed to track click:', error);
        }
    }
  };

  const handleJoin = async (id) => {
    if(!window.confirm('確定要報名這個活動嗎？')) return;
    
    setJoiningId(id);
    try {
      await joinEvent(id);
      alert('報名成功！');
      
      // 重新載入活動列表以獲取正確的參與人數
      setLoading(true);
      if (showRecommend) {
        const data = await fetchEventFeed({ isRecommend: true });
        setEvents(data);
      } else {
        const data = await fetchEventFeed({
          type: filterType === '全部' ? null : filterType,
          groupId: filterGroup === 'all' ? null : filterGroup,
          isRecommend: false
        });
        setEvents(data);
      }
      setLoading(false);
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('已經報名') || msg.includes('已報名')) {
        alert('你已經報名過這個活動囉！');
      } else if (msg.includes('活動已額滿') || msg.includes('已滿')) {
        alert('活動已額滿，無法報名');
      } else if (msg.includes('限定群組') || msg.includes('不在該群組')) {
        alert('此活動限定群組成員才能報名');
      } else if (msg.includes('已關閉')) {
        alert('活動已關閉，無法報名');
      } else {
        alert(msg || '加入活動失敗，請稍後再試');
      }
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">正在載入活動...</div>;

  return (
    <div className="pb-24 animate-fade-in">
      
      {/* Header */}
      <div className="bg-brand-dark text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <h1 className="text-2xl font-bold tracking-wider text-brand-yellow">🎯 找活動</h1>
        <p className="text-sm text-gray-300 mt-1">發現有趣的活動，加入你的校園生活</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Section 1: 一鍵推薦 */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-5 shadow-sm border border-yellow-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold text-gray-800">✨ 為你推薦</h2>
              <p className="text-xs text-gray-600 mt-1">根據你的群組和興趣推薦活動</p>
            </div>
            <button 
              onClick={handleRecommendToggle}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${
                showRecommend 
                ? 'bg-brand-yellow text-brand-dark border-2 border-yellow-400' 
                : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-yellow-400'
              }`}
            >
              {showRecommend ? '★ 推薦中' : '☆ 一鍵推薦'}
            </button>
          </div>
        </div>

        {/* Section 2: 查詢活動 */}
        {!showRecommend && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold text-gray-800 mb-4">🔍 查詢活動</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">活動類型</label>
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full bg-gray-50 text-gray-800 text-sm rounded-xl px-4 py-2.5 border border-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                >
                  {activityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 mb-1.5 block">限定群組</label>
                <select 
                  value={filterGroup}
                  onChange={(e) => setFilterGroup(e.target.value)}
                  className="w-full bg-gray-50 text-gray-800 text-sm rounded-xl px-4 py-2.5 border border-gray-300 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200"
                >
                  {groupFilters.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 space-y-4">
        {events.length === 0 && (
            <div className="text-center text-gray-400 py-10">
                沒有符合條件的活動 🥲
            </div>
        )}
        
        {events.length > 0 && (
          <div className="text-sm text-gray-500 text-center mb-4">
            顯示 {((currentPage - 1) * eventsPerPage) + 1}-{Math.min(currentPage * eventsPerPage, events.length)} / {events.length} 個活動
          </div>
        )}
        
        {events.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage).map(ev => {
          // 渲染邏輯
          const percent = Math.min(100, (ev.currentPeople / ev.capacity) * 100);
          const isFull = ev.currentPeople >= ev.capacity;
          
          return (
            <div key={ev.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              {/* 卡片 Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{ev.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded font-medium">{ev.type}</span>
                      {ev.isGroupLimit && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded">
                           🔒 {ev.groupName || '群組'}限定
                        </span>
                      )}
                      <span className={`px-2 py-0.5 rounded font-medium ${
                        ev.status === 'Open' ? 'bg-green-100 text-green-700' :
                        ev.status === 'Closed' ? 'bg-gray-100 text-gray-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {ev.status === 'Open' ? '開放' : ev.status === 'Closed' ? '已關閉' : '已取消'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片 Body */}
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">{ev.content || '無描述'}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                  <span className="flex items-center gap-1">🕒 {ev.startTime || '未定'}</span>
                  <span className="flex items-center gap-1">📍 {ev.location}</span>
                </div>
              </div>

              {/* 卡片 Footer (進度條與按鈕) */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">主辦: {ev.hostName}</span>
                    <span className={isFull ? "text-red-500 font-bold" : "text-brand-dark"}>
                      {ev.currentPeople} / {ev.capacity} 人
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isFull ? 'bg-red-400' : 'bg-brand-yellow'}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  onClick={() => handleJoin(ev.id)}
                  disabled={isFull || ev.hasJoined || joiningId === ev.id}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-sm ${
                    ev.hasJoined 
                      ? 'bg-green-100 text-green-700 cursor-default'
                      : isFull 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-brand-dark text-white hover:bg-gray-800 active:scale-95'
                  }`}
                >
                  {joiningId === ev.id ? '...' : ev.hasJoined ? '已報名' : isFull ? '已滿' : '加入'}
                </button>
              </div>
            </div>
          );
        })}
        
        {events.length > eventsPerPage && (
          <div className="flex justify-center gap-3 mt-6 pb-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              ← 上一頁
            </button>
            <span className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium">
              {currentPage} / {Math.ceil(events.length / eventsPerPage)}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(Math.ceil(events.length / eventsPerPage), p + 1))}
              disabled={currentPage >= Math.ceil(events.length / eventsPerPage)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              下一頁 →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}