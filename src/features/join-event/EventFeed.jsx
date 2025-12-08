// src/features/join-event/EventFeed.jsx

import { useState, useEffect } from 'react';
import { fetchEventFeed, joinEvent } from '../../api/feed';
import { fetchEventTypes, fetchGroups } from '../../api/admin';

// 輔助函式 (略，假設已在 feed.js 或 utils 中定義)
// const getIconByType = (type) => { ... }; 

export default function EventFeed() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null); 
  
  // [關鍵狀態] 篩選狀態
  const [filterType, setFilterType] = useState('全部');
  const [isRecommend, setIsRecommend] = useState(false);
  const [filterGroup, setFilterGroup] = useState('all');

  // [新增] 動態載入的選項
  const [activityTypes, setActivityTypes] = useState([{ value: "全部", label: "所有類型" }]);
  const [groupFilters, setGroupFilters] = useState([{ value: "all", label: "顯示所有活動" }]);

  // [新增] 載入活動類型和群組列表
  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [types, groups] = await Promise.all([
          fetchEventTypes(),
          fetchGroups()
        ]);
        
        // 轉換活動類型格式
        const typeOptions = [
          { value: "全部", label: "所有類型" },
          ...types.map(t => ({ value: t.type_name, label: `${t.type_name}` }))
        ];
        setActivityTypes(typeOptions);
        
        // 轉換群組格式
        const groupOptions = [
          { value: "all", label: "顯示所有活動" },
          ...groups.map(g => ({ value: String(g.group_id), label: `${g.group_name}` }))
        ];
        setGroupFilters(groupOptions);
      } catch (error) {
        console.error('Failed to load filters:', error);
      }
    };
    
    loadFilters();
  }, []);

  // [關鍵邏輯] 當篩選條件改變時，重新呼叫後端
  useEffect(() => {
    setLoading(true);
    fetchEventFeed({
      type: filterType,
      groupId: filterGroup,
      isRecommend: isRecommend
    }).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [filterType, filterGroup, isRecommend]); // 監聽這些變數

  const handleJoin = async (id) => {
    if (!window.confirm('確定要報名這個活動嗎？')) return;
+
    setJoiningId(id);
    try {
      const result = await joinEvent(id);
      if (result && result.success) {
        // 成功後，更新列表（或重新拉取資料）
        setEvents(prev => prev.map(ev =>
          ev.id === id ? { ...ev, currentPeople: (Number(ev.currentPeople) || 0) + 1, hasJoined: true } : ev
        ));
      } else {
        // unexpected but not thrown
        console.warn('joinEvent returned non-success:', result);
        alert('加入活動失敗，請稍後再試');
      }
    } catch (err) {
      // handle known backend message for duplicate join
      const msg = err?.message || (err?.response?.data?.error) || '';
      if (msg.includes('已經報名') || msg.includes('已報名')) {
        // Mark as joined in UI to reflect backend state
        setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, hasJoined: true } : ev));
        alert('你已經報名過這個活動囉！');
      } else if (msg.includes('活動已額滿') || msg.includes('已滿')) {
        alert('活動已額滿，無法報名');
      } else {
        console.error('joinEvent failed', err);
        alert('加入活動失敗，請稍後再試');
      }
    } finally {
      setJoiningId(null);
    }
  };

  if (loading) return <div className="p-10 text-center text-gray-500">正在載入活動...</div>;

  return (
    <div className="pb-24 animate-fade-in">
      
      {/* 1. Header 與篩選控制區 */}
      <div className="bg-brand-dark text-white p-6 rounded-b-3xl shadow-lg mb-6 sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-wider text-brand-yellow">JoJo 活動廣場</h1>
        
        <div className="mt-4 flex flex-col gap-3">
            
            {/* 推薦按鈕 & 類型篩選 */}
            <div className="flex gap-2">
                <button 
                    onClick={() => setIsRecommend(!isRecommend)}
                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all border ${
                        isRecommend 
                        ? 'bg-brand-yellow text-brand-dark border-brand-yellow' 
                        : 'bg-gray-700 text-gray-300 border-gray-600'
                    }`}
                >
                    {isRecommend ? '★ 已開啟推薦' : '☆ 推薦給我'}
                </button>

                <select 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    disabled={isRecommend} 
                    className="flex-1 bg-gray-700 text-white text-sm rounded-xl px-3 border border-gray-600 outline-none"
                >
                    {activityTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </select>
            </div>

            {/* 限定群組篩選 */}
            <select 
                value={filterGroup}
                onChange={(e) => setFilterGroup(e.target.value)}
                className="w-full bg-gray-700 text-white text-sm rounded-xl px-3 py-2 border border-gray-600 outline-none"
            >
                {groupFilters.map(group => (
                    <option key={group.value} value={group.value}>{group.label}</option>
                ))}
            </select>
        </div>
      </div>

      {/* 2. 活動列表區 */}
      <div className="px-4 space-y-4">
        {events.length === 0 && (
            <div className="text-center text-gray-400 py-10">
                沒有符合條件的活動 🥲
            </div>
        )}
        {events.map(ev => {
          // 渲染邏輯 — 防護 capacity 為 null/0，避免 NaN/Infinity
          const capacity = ev.capacity ?? null;
          const current = Number(ev.currentPeople ?? 0);
          const percent = capacity ? Math.min(100, (current / capacity) * 100) : 0;
          const isFull = capacity ? current >= capacity : false;
          
           return (
             <div key={ev.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              {/* 卡片 Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div>
                    <h3 className="font-bold text-gray-800 line-clamp-1">{ev.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">{ev.type}</span>
                      {ev.isGroupLimit && (
                        <span className="px-2 py-0.5 bg-red-50 text-red-500 border border-red-100 rounded">
                           🔒 {ev.groupName || '群組'}限定
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 卡片 Body */}
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {ev.description ?? ev.content ?? ev.content_preview ?? '無描述'}
                </p>
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
                      {current} / {capacity ?? '—'} 人
                    </span>
                  </div>
                  <div
                    className={`h-full rounded-full ${isFull ? 'bg-red-400' : 'bg-brand-yellow'}`}
                    style={{ width: `${percent}%` }}
                  ></div>
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
      </div>
    </div>
  );
}