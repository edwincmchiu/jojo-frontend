// src/api/feed.js
import axios from 'axios';
// Use backend host directly in dev to avoid Vite proxy issues
const API_URL = import.meta.env.DEV ? 'http://localhost:3010/api' : '/api';
// API_BASE_URL is kept for fetch-based calls
const API_BASE_URL = API_URL;

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

    // Backend exposes /api/events (not /api/events/feed) — call that and include query params if any.
    const url = `${API_URL}/events${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axios.get(url);
     const data = response.data;
 
     // Normalize response: accept array or { events: [...] }
     const dbEvents = Array.isArray(data) ? data : (data?.events || data?.data || []);
     if (!Array.isArray(dbEvents)) {
       console.warn('[API] /events/feed returned non-array:', data);
       return [];
     }
 
    return dbEvents.map(ev => ({
      id: ev.event_id ?? ev.Event_id ?? ev.id,
      title: ev.title ?? ev.Title ?? ev.name ?? ev.title,
      description: ev.content_preview ?? ev.content ?? ev.Description ?? ev.description,
      type: ev.type_name ?? ev.Type ?? ev.type,
      startTime: ev.start_time ?? ev.Start_time ?? ev.startTime ?? ev.start,
      capacity: ev.capacity ?? ev.Capacity ?? null,
      currentPeople: ev.currentPeople ?? ev.current_people ?? ev.Current_people ?? ev.currentPeople ?? 0,
      hostId: ev.owner_id ?? ev.Owner_id ?? ev.hostId ?? ev.host_id,
      hostName: ev.owner_name ?? ev.Host_name ?? ev.hostName ?? 'Unknown',
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