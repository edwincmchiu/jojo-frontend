// src/api/feed.js

// 對應後端 .env 的 PORT=3010
const API_BASE_URL = '/api';

// 輔助函式：根據活動類型給對應的 Icon
const getIconByType = (type) => {
    const map = { 
        '宵夜': '🍜', 
        '運動': '🏀', 
        '讀書': '📚', 
        '出遊': '🚗', 
        '共煮': '🍳', 
        '其他': '✨' 
    };
    return map[type] || '📅';
};

// 輔助函式：簡單的時間格式化 (因為後端吐的是 ISO 格式)
const formatTime = (isoString) => {
    if (!isoString) return '時間未定';
    const date = new Date(isoString);
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

export const fetchEventFeed = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.type && filters.type !== '全部') params.append('type', filters.type);
    if (filters.groupId && filters.groupId !== 'all') params.append('groupId', filters.groupId);
    
    if (filters.isRecommend) {
      params.append('recommend', 'true');
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        const userId = user.id || user.user_id;
        params.append('userId', userId);
      }
    }

    const response = await fetch(`${API_BASE_URL}/events?${params}`);
    const data = await response.json();

    const dbEvents = Array.isArray(data) ? data : [];

    return dbEvents.map(ev => ({
      id: ev.event_id,
      title: ev.title,
      description: ev.content,
      type: ev.type_name,
      startTime: formatTime(ev.start_time),
      capacity: ev.capacity,
      currentPeople: ev.current_people ?? 0,
      hostId: ev.owner_id,
      hostName: ev.owner_name ?? 'Unknown',
      location: ev.location ?? '地點未定',
      status: ev.status ?? 'Open',
      isGroupLimit: !!ev.group_id,
      groupName: ev.group_name,
    }));
  } catch (error) {
    console.error('[API] 取得活動列表失敗:', error);
    return [];
  }
};

export const joinEvent = async (eventId) => {
  try {
    const userStr = localStorage.getItem('user');
    if (!userStr) throw new Error('請先登入');
    
    const user = JSON.parse(userStr);
    const userId = user.id || user.user_id;

    const response = await fetch(`${API_BASE_URL}/events/${eventId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Join failed'); 
    }

    return { success: true };

  } catch (error) {
    console.error("[API] 加入活動失敗:", error);
    throw error;
  }
};