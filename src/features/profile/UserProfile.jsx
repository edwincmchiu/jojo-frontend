import { useState, useEffect } from 'react';
import { fetchUserProfile, addPreference, removePreference, addGroup, removeGroup, fetchAvailableGroups, fetchAvailableTypes, cancelEvent } from '../../api/profile';
import axios from 'axios';

export default function UserProfile({userId}) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('joined'); // 'joined' 或 'hosted'

  const [isAddingTag, setIsAddingTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [availableTypes, setAvailableTypes] = useState([]);
  
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [availableGroups, setAvailableGroups] = useState([]);

  // 1. 取得使用者資料
  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId).then(data => {
        setUser(data);
        setLoading(false);
      });
      fetchAvailableGroups().then(groups => {
        setAvailableGroups(groups);
      });
      fetchAvailableTypes().then(types => {
        setAvailableTypes(types);
      });
    }
  }, [userId]);  // 2. 新增興趣標籤邏輯
  const handleAddInterest = async () => {
    if (!selectedTag) return;
    try {
      await addPreference(user.id, selectedTag);
      setUser(prev => ({
        ...prev,
        interests: Array.from(new Set([...(prev?.interests || []), selectedTag]))
      }));
      setSelectedTag('');
      setIsAddingTag(false);
    } catch (err) {
      console.error('Error adding preference: ', err);
    }
  }

  // 3. 移除興趣標籤逻輯
  const handleRemoveInterest = async (typeNameToRemove) => {
    try {
      await removePreference(user.id, typeNameToRemove);
      setUser(prev => ({
        ...prev,
        interests: (prev?.interests || []).filter(i => {
          const name = typeof i === 'string' ? i : (i?.Type_name ?? i?.type_name ?? i?.name);
          return name !== typeNameToRemove;
        })
      }));
    } catch (err) {
      console.error('remove interest failed', err);
    }
  };

  // 4. 加入群組
  const handleAddGroup = async () => {
    if (!selectedGroup) return;
    try {
      await addGroup(user.id, selectedGroup);
      
      // 重新獲取完整的 profile 資料，確保資料一致性
      const updatedProfile = await fetchUserProfile(user.id);
      setUser(updatedProfile);
      
      setSelectedGroup('');
      setIsAddingGroup(false);
    } catch (err) {
      console.error('Error adding group:', err);
    }
  };

  // 5. 離開群組
  const handleRemoveGroup = async (groupId) => {
    try {
      await removeGroup(user.id, groupId);
      setUser(prev => ({
        ...prev,
        groups: (prev?.groups || []).filter(g => g.id !== groupId)
      }));
    } catch (err) {
      console.error('Error removing group:', err);
    }
  };

  // 6. 取消活動
  const handleCancelEvent = async (eventId, eventTitle, currentPeople) => {
    const message = currentPeople > 0 
      ? `確定要取消活動「${eventTitle}」嗎？\n目前有 ${currentPeople} 人已報名。`
      : `確定要取消活動「${eventTitle}」嗎？`;
    
    if (!window.confirm(message)) return;
    
    try {
      const response = await cancelEvent(eventId);
      // 重新載入個人資料
      const updatedProfile = await fetchUserProfile(user.id);
      setUser(updatedProfile);
      
      const affectedCount = response?.data?.affectedParticipants || currentPeople || 0;
      if (affectedCount > 0) {
        alert(`活動已取消\n共有 ${affectedCount} 位參與者受到影響`);
      } else {
        alert('活動已取消');
      }
    } catch (err) {
      console.error('Error canceling event:', err);
      alert('取消活動失敗，請稍後再試');
    }
  };

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

          {/* 2. 群組標籤 (USER_GROUP Table) - 藍色系 */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {user.groups.map(g => (
              <span 
                key={g.id} 
                onClick={() => handleRemoveGroup(g.id)}
                className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium border border-blue-200 hover:bg-red-100 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                {g.type === 'dorm' ? '🏠' : '🎓'} {g.name}
                <span className="text-sm">×</span>
              </span>
            ))}
            
            {/* 新增群組按鈕 */}
            {isAddingGroup ? (
              <div className="flex gap-2 items-center">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="px-2 py-1 rounded-full text-xs border border-blue-300 focus:border-blue-500 focus:outline-none"
                >
                  <option value="">選擇群組...</option>
                  {availableGroups
                    .filter(g => !user.groups.some(ug => ug.id === g.group_id))
                    .map(g => (
                      <option key={g.group_id} value={g.group_id}>
                        {g.name}
                      </option>
                    ))}
                </select>
                <button 
                  onClick={handleAddGroup} 
                  disabled={!selectedGroup}
                  className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
                >
                  加入
                </button>
                <button 
                  onClick={() => setIsAddingGroup(false)}
                  className="px-3 py-1 text-gray-500 rounded-full text-xs hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setIsAddingGroup(true)}
                className="px-3 py-1 border border-dashed border-blue-300 text-blue-500 rounded-full text-xs hover:bg-blue-50 transition-colors font-medium"
              >
                + 加入群組
              </button>
            )}
          </div>

          {/* 3. 興趣標籤 (PREFERENCE Table) - 紫色系 */}
          <div className="flex flex-wrap justify-center gap-2">
            
            {/* 顯示已有的興趣標籤 (變成可移除的按鈕) */}
            {user?.interests?.map((interest, idx) => {
              const label = typeof interest === 'string'
                ? interest
                : (interest?.Type_name ?? interest?.type_name ?? interest?.name ?? `interest-${idx}`);
              return (
                <span
                  key={`${label}-${idx}`}
                  onClick={() => handleRemoveInterest(label)}
                  className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-xs font-medium border border-purple-200 hover:bg-red-100 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {label}
                  <span className="text-sm">×</span>
                </span>
              );
            })}
            
            {/* 關鍵的條件渲染邏輯：新增標籤選單 */}
            {isAddingTag ? (
              <div className="flex gap-2 items-center">
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-2 py-1 rounded-full text-xs border border-purple-300 focus:border-purple-500 focus:outline-none"
                >
                  <option value="">選擇興趣...</option>
                  {availableTypes
                      .filter(tag => !user.interests.includes(tag))
                      .map(tag => (
                          <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                
                {/* 儲存按鈕 */}
                <button 
                  onClick={handleAddInterest} 
                  disabled={!selectedTag} 
                  className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-600 transition-colors"
                >
                  儲存
                </button>
                
                <button 
                  onClick={() => setIsAddingTag(false)}
                  className="px-3 py-1 text-gray-500 rounded-full text-xs hover:bg-gray-100 transition-colors"
                >
                  取消
                </button>
              </div>
            ) : (
              // 否則顯示原本的 +新增按鈕
              <button 
                onClick={() => setIsAddingTag(true)} 
                className="px-3 py-1 border border-dashed border-purple-300 text-purple-500 rounded-full text-xs hover:bg-purple-50 transition-colors font-medium"
              >
                + 新增
              </button>
            )}
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
          {(activeTab === 'joined' ? user.joinedEvents : user.hostedEvents)?.map((ev) => (
            <div key={ev?.id ?? `event-${Math.random()}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2 flex-1">
                  <h4 className="font-bold text-gray-800 text-lg">{ev.title}</h4>
                  <span className="px-2 py-1 bg-purple-50 text-purple-600 text-xs rounded-lg font-medium">
                    {ev.typeName}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    ev.status === 'Open' ? 'bg-green-100 text-green-700' :
                    ev.status === 'Closed' ? 'bg-gray-100 text-gray-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {ev.status === 'Open' ? '開放' : ev.status === 'Closed' ? '已關閉' : '已取消'}
                  </span>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <span>📅</span>
                  <span>{ev.startTime} ~ {ev.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>{ev.location || '地點未定'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{ev.groupName === '公開活動' ? '🌍' : '🔒'}</span>
                  <span>{ev.groupName}</span>
                </div>
                {activeTab === 'hosted' && ev.capacity && (
                  <div className="flex items-center gap-2">
                    <span>👥</span>
                    <span>{ev.currentPeople} / {ev.capacity} 人</span>
                  </div>
                )}
              </div>
              {activeTab === 'hosted' && ev.status === 'Open' && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => handleCancelEvent(ev.id, ev.title, ev.currentPeople)}
                    className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all"
                  >
                    取消活動
                  </button>
                </div>
              )}
            </div>
          ))}

          {(activeTab === 'hosted' && user.hostedEvents.length === 0) && (
             <div className="text-center py-8 text-gray-400 text-sm">
                你還沒有舉辦過活動喔！<br/>趕快按「開團」試試看吧！
             </div>
          )}
        </div>
      </div>
      
      {/* Logout Button
      <div className="px-6 mt-8">
        <button className="w-full py-3 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 transition-all">
          登出帳號
        </button>
        <p className="text-center text-xs text-gray-300 mt-4">JoJo v1.0.0 (Build 20251128)</p>
      </div> */}

    </div>
  );
}