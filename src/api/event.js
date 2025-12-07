// 定義後端 API 的基礎網址
const API_BASE_URL = '/api'; 

// 建立活動 (Create Event)
// 這會觸發後端的 Transaction: 
// 1. INSERT INTO EVENT
// 2. (如果有借場地) INSERT INTO VENUE_BOOKING
// 3. INSERT INTO JOIN_RECORD (主辦人自己加入)

export const createEvent = async (eventData, userId) => {
  try {
    const dataWithUserId = { ...eventData, userId };
    console.log('[API] Sending data to backend:', dataWithUserId);

    // 發送 POST 請求
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // 告訴後端我們傳的是 JSON
      },
      body: JSON.stringify(dataWithUserId) // 把前端的物件轉成 JSON 字串
    });

    // 檢查 HTTP 狀態碼 (200-299 代表成功)
    if (!response.ok) {
      // 嘗試讀取後端回傳的錯誤訊息
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // 解析後端回傳的結果 (通常包含新建立的 eventId)
    const result = await response.json();
    
    console.log('[API] Create success:', result);
    return { success: true, eventId: result.eventId };

  } catch (error) {
    console.error("[API] Failed to create event:", error);
    // 回傳失敗狀態，讓前端 UI 可以顯示錯誤 (例如 alert)
    return { success: false, error: error.message };
  }
};