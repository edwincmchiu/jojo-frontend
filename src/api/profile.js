// src/api/profile.js

// 對應後端 .env 的 PORT=3010
const API_BASE_URL = '/api';

// [輔助] 簡單的性別轉頭像邏輯
const getAvatar = (sex) => {
  return sex === 'Female' ? '👩‍🎓' : '👨‍🎓';
};

// [輔助] 格式化日期 (把 ISO 時間轉成 "2025/10/30")
const formatDate = (isoString) => {
  if (!isoString) return '未定';
  const d = new Date(isoString);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

export const fetchUserProfile = async () => {
  try {
    // 假設目前登入的使用者 ID = 1 (為了 Demo 先寫死)
    // 實際情況下，這個 ID 應該來自登入後的 Token 或 Session
    const currentUserId = 1;

    console.log(`[API] Fetching profile for User ${currentUserId}...`);

    // 呼叫後端 API (GET /users/1/profile)
    // 後端需要執行多個 SQL 查詢並打包回傳
    const response = await fetch(`${API_BASE_URL}/users/${currentUserId}/profile`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const dbData = await response.json();

    // [資料轉換] 將後端 DB 欄位轉為前端 UI 格式
    return {
      id: dbData.User_id,
      name: dbData.Name,
      email: dbData.Email,
      phone: dbData.Phone || '無電話',
      avatar: getAvatar(dbData.Sex), // 根據 DB 的 Sex 欄位決定
      
      // 轉換群組資料 (USER_GROUP JOIN GROUP)
      groups: (dbData.groups || []).map(g => ({
        id: g.Group_id,
        name: g.Name,
        type: g.Type || 'General' // 如果 DB 沒存 type，給預設值
      })),

      // 轉換興趣資料 (PREFERENCE)
      interests: (dbData.interests || []).map(i => i.Type_name),

      // 轉換主辦活動 (EVENT where Owner_id = me)
      hostedEvents: (dbData.hostedEvents || []).map(e => ({
        id: e.Event_id,
        title: e.Title,
        date: formatDate(e.Start_time),
        status: e.Status,
        count: e.current_people || 0 // 後端需計算人數
      })),

      // 轉換參加活動 (JOIN_RECORD JOIN EVENT)
      joinedEvents: (dbData.joinedEvents || []).map(e => ({
        id: e.Event_id,
        title: e.Title,
        date: formatDate(e.Start_time),
        status: e.Status, // 這裡是活動狀態，不是報名狀態
        count: e.current_people || 0
      }))
    };

  } catch (error) {
    console.error("[API] 取得個人資料失敗:", error);
    
    // 發生錯誤時回傳一個「空」的物件，避免頁面全白
    return {
      id: 'error',
      name: '讀取失敗',
      email: '請檢查後端連線',
      phone: '',
      avatar: '😵',
      groups: [],
      interests: [],
      hostedEvents: [],
      joinedEvents: []
    };
  }
};