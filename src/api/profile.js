import axios from 'axios';

// 設定後端 API 網址
// 如果你的 vite.config.js 有設定 proxy，這裡可以用 '/api'
const API_URL = '/api';

// [輔助] 簡單的性別轉頭像邏輯
const getAvatar = (sex) => {
  if (!sex) return '😎'; // 預設值
  return sex === 'Female' ? '👩‍🎓' : '👨‍🎓';
};

// [輔助] 格式化日期 (把 ISO 時間轉成 "2025/10/30")
const formatDate = (isoString) => {
  if (!isoString) return '未定';
  try {
    const d = new Date(isoString);
    return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  } catch (e) {
    return isoString;
  }
};

export const fetchUserProfile = async (userId) => {
  try {
    console.log(`[API] Fetching profile for User ${userId}...`);

    // 1. 發送請求 (使用 axios)
    const response = await axios.get(`${API_URL}/users/${userId}/profile`);
    
    // 2. 取得資料 (Axios 自動會把 JSON 放在 .data 裡面)
    const data = response.data;

    // 3. [資料轉換] 將後端 DB 欄位 (PascalCase) 轉為前端 UI 格式 (camelCase)
    return {
      id: data.User_id,
      name: data.Name,
      email: data.Email,
      phone: data.Phone || '無電話',
      avatar: getAvatar(data.Sex), // 資料庫欄位通常是 Sex
      
      // 轉換群組資料
      groups: (data.groups || []).map(g => ({
        id: g.Group_id,
        name: g.Name,
        type: g.Group_id === 2 ? 'Dorm' : 'Dept' // 簡單判斷：男一舍是 Dorm
      })),

      // 轉換興趣資料
      interests: (data.interests || []).map(i => i.Type_name),

      // 轉換主辦活動
      hostedEvents: (data.hostedEvents || []).map(e => ({
        id: e.Event_id,
        title: e.Title,
        date: formatDate(e.Start_time),
        status: e.Status || 'Open',
        count: e.Capacity // 暫時顯示人數上限，因為後端可能還沒做 current_people
      })),

      // 轉換參加活動
      joinedEvents: (data.joinedEvents || []).map(e => ({
        id: e.Event_id,
        title: e.Title,
        date: formatDate(e.Start_time),
        status: e.Status || 'Open',
        count: e.Capacity
      }))
    };

  } catch (error) {
    console.error("[API] 取得個人資料失敗:", error);
    
    // 發生錯誤時回傳一個「空」的物件，避免頁面崩潰 (White Screen)
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