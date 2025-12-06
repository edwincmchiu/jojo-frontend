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
    // 1. 建立 URL 參數
    const params = new URLSearchParams();
    
    // 如果有選類型
    if (filters.type && filters.type !== '全部') params.append('type', filters.type);
    
    // 如果有選群組
    if (filters.groupId && filters.groupId !== 'all') params.append('groupId', filters.groupId);
    
    // 如果按了「一鍵推薦」
    if (filters.isRecommend) {
        params.append('recommend', 'true');
        params.append('userId', '1'); // 前端 Demo 固定傳送 User ID 1
    }

    // 2. 發送請求
    const response = await fetch(`${API_BASE_URL}/events?${params.toString()}`);
    
    // 檢查 HTTP 狀態碼
    if (!response.ok) {
        // 如果是 4xx 或 5xx，當作 Network Error 處理
        throw new Error('Network error or server error when fetching events.');
    }
    const dbEvents = await response.json();

    // [關鍵步驟] 資料轉換 (Mapping)
    const uiEvents = dbEvents.map(ev => ({
        id: ev.Event_id,            
        title: ev.Title,            
        type: ev.Type_name,         
        icon: getIconByType(ev.Type_name), 
        content: ev.Content,        
        location: ev.Location_desc || '未知地點', 
        startTime: formatTime(ev.Start_time),
        endTime: formatTime(ev.End_time).split(' ')[1],
        currentPeople: ev.current_people || 1, // 預設值
        capacity: ev.Capacity,
        hostName: ev.Owner_name || '同學', 
        isGroupLimit: !!ev.Group_id, 
        groupName: ev.Group_name || ''
    }));

    return uiEvents;

  } catch (error) {
    console.error("[API] 取得活動列表失敗:", error);
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