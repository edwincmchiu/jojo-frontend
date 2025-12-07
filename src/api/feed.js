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

// 1. 取得活動列表 (GET /events) - 包含篩選邏輯
export const fetchEventFeed = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.group) params.append('group', filters.group);
    if (filters.recommend) params.append('recommend', filters.recommend);

    const response = await axios.get(`${API_URL}/events/feed?${params}`);
    const data = response.data;

    // Normalize response: backend may return { events: [...] } or just [...]
    const dbEvents = Array.isArray(data) ? data : (data?.events || data?.data || []);

    if (!Array.isArray(dbEvents)) {
      console.warn('[API] Response is not an array, returning empty:', data);
      return [];
    }

    return dbEvents.map(ev => ({
      id: ev.Event_id ?? ev.id,
      title: ev.Title ?? ev.title,
      description: ev.Description ?? ev.description,
      type: ev.Type ?? ev.type,
      startTime: ev.Start_time ?? ev.startTime,
      capacity: ev.Capacity ?? ev.capacity,
      currentPeople: ev.Current_people ?? ev.currentPeople ?? 0,
      hostId: ev.Host_id ?? ev.hostId,
      hostName: ev.Host_name ?? ev.hostName ?? 'Unknown',
    }));
  } catch (error) {
    console.error('[API] 取得活動列表失敗:', error);
    return [];
  }
};

// 2. 加入活動 (POST /events/:id/join)
export const joinEvent = async (eventId) => {
  try {
    const currentUserId = 1; 

    const response = await fetch(`${API_BASE_URL}/events/${eventId}/join`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUserId })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      // 拋出後端回傳的錯誤訊息 (例如：你已經報名過這個活動囉！)
      throw new Error(errData.error || 'Join failed'); 
    }

    return { success: true };

  } catch (error) {
    console.error("[API] 加入活動失敗:", error);
    alert(error.message); 
    return { success: false };
  }
};