import { useState, useEffect } from 'react';
import { fetchUserProfile } from '../../api/profile';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joined'); // 'joined' 或 'hosted'

  useEffect(() => {
    fetchUserProfile().then(data => {
      setUser(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-400">載入個人資料...</div>;

  return (
    <div className="animate-fade-in bg-gray-50 min-h-full">
      
      {/* 1. Header & 基本資料 (USER Table) */}
      <div className="bg-white p-8 pb-10 shadow-sm mb-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-brand-yellow rounded-full flex items-center justify-center text-5xl shadow-md border-4 border-white mb-4">
            {user.avatar}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-500 text-sm mb-4">{user.email}</p>

          {/* 2. 群組標籤 (USER_GROUP Table) */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {user.groups.map(g => (
              <span key={g.id} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                {g.type === 'Dorm' ? '🏠' : '🎓'} {g.name}
              </span>
            ))}
          </div>

          {/* 3. 興趣標籤 (PREFERENCE Table) */}
          <div className="flex flex-wrap justify-center gap-2">
            {user.interests.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                {tag}
              </span>
            ))}
            <button className="px-3 py-1 border border-dashed border-gray-300 text-gray-400 rounded-lg text-xs hover:bg-gray-50">
              + 新增
            </button>
          </div>
        </div>
      </div>

      {/* 4. 活動紀錄 (EVENT & JOIN_RECORD Tables) */}
      <div className="px-8 max-w-4xl mx-auto">
        <h3 className="font-bold text-2xl text-gray-800 mb-4">我的活動紀錄</h3>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-200 p-1 rounded-xl mb-4">
          <button 
            onClick={() => setActiveTab('joined')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'joined' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
          >
            我參加的
          </button>
          <button 
            onClick={() => setActiveTab('hosted')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'hosted' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
          >
            我主辦的
          </button>
        </div>

        {/* List Content */}
        <div className="space-y-3">
          {(activeTab === 'joined' ? user.joinedEvents : user.hostedEvents).map(ev => (
            <div key={ev.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-gray-800">{ev.title}</h4>
                <div className="text-xs text-gray-500 mt-1 flex gap-3">
                  <span>📅 {ev.date}</span>
                  <span>👥 {ev.count} 人</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                ev.status === 'Open' ? 'bg-green-100 text-green-600' :
                ev.status === 'Closed' ? 'bg-gray-100 text-gray-500' :
                'bg-red-50 text-red-500'
              }`}>
                {ev.status === 'Open' ? '進行中' : ev.status === 'Closed' ? '已結束' : '已取消'}
              </span>
            </div>
          ))}

          {(activeTab === 'hosted' && user.hostedEvents.length === 0) && (
             <div className="text-center py-8 text-gray-400 text-sm">
                你還沒有舉辦過活動喔！<br/>趕快按「開團」試試看吧！
             </div>
          )}
        </div>
      </div>
      
      {/* Logout Button */}
      <div className="px-6 mt-8">
        <button className="w-full py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all">
          登出帳號
        </button>
        <p className="text-center text-xs text-gray-300 mt-4">JoJo v1.0.0 (Build 20251128)</p>
      </div>

    </div>
  );
}