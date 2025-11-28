// src/features/join-event/EventFeed.jsx
import { useState, useEffect } from 'react';
import { fetchEventFeed, joinEvent } from '../../api/feed';

export default function EventFeed() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);

  useEffect(() => {
    fetchEventFeed().then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  const handleJoin = async (id) => {
    if(!window.confirm('確定要報名這個活動嗎？')) return;
    
    setJoiningId(id);
    await joinEvent(id);
    
    // 前端樂觀更新 (Optimistic Update): 讓使用者覺得很快
    setEvents(prev => prev.map(ev => 
      ev.id === id ? { ...ev, currentPeople: ev.currentPeople + 1, hasJoined: true } : ev
    ));
    setJoiningId(null);
  };

  if (loading) return <div className="p-10 text-center text-gray-500">載入活動中...</div>;

  return (
    <div className="pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-brand-dark text-white p-6 rounded-b-3xl shadow-lg mb-6 sticky top-0 z-10">
        <h1 className="text-xl font-bold tracking-wider text-brand-yellow">JoJo 活動廣場</h1>
        <p className="text-xs text-gray-400 mt-1">即時媒合校園生活夥伴</p>
      </div>

      <div className="px-4 space-y-4">
        {events.map(ev => {
          const isFull = ev.currentPeople >= ev.capacity;
          const percent = Math.min(100, (ev.currentPeople / ev.capacity) * 100);

          return (
            <div key={ev.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-xl border border-yellow-100">
                    {ev.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{ev.title}</h3>
                    <div className="flex gap-2 text-xs mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{ev.type}</span>
                      {ev.isGroupLimit && <span className="px-2 py-0.5 bg-red-50 text-red-500 rounded border border-red-100">🔒 {ev.groupName}</span>}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{ev.content}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span>🕒 {ev.startTime}</span>
                <span>📍 {ev.location}</span>
              </div>

              {/* Progress Bar & Button */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <div className="flex-1 mr-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">主辦: {ev.hostName}</span>
                    <span className={isFull ? "text-red-500 font-bold" : "text-brand-dark"}>
                      {ev.currentPeople} / {ev.capacity} 人
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${isFull ? 'bg-red-400' : 'bg-brand-yellow'}`} style={{ width: `${percent}%` }}></div>
                  </div>
                </div>

                <button 
                  onClick={() => handleJoin(ev.id)}
                  disabled={isFull || ev.hasJoined || joiningId === ev.id}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                    ev.hasJoined ? 'bg-green-100 text-green-700' : 
                    isFull ? 'bg-gray-100 text-gray-400' : 
                    'bg-brand-dark text-white hover:bg-gray-800'
                  }`}
                >
                  {ev.hasJoined ? '已報名' : isFull ? '額滿' : '加入'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}