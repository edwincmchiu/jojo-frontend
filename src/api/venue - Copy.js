// 定義後端 API 的基礎網址
// ⚠️ 注意：對應你後端 .env 的 PORT=3010
const API_BASE_URL = 'http://localhost:3010/api'; 

// 1. 取得所有場地 (對應 SELECT * FROM VENUE)
export const fetchVenues = async () => {
  try {
    // 發送請求給後端
    const response = await fetch(`${API_BASE_URL}/venues`);
    
    // 檢查回應是否成功
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 解析 JSON 資料
    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("無法取得場地列表:", error);
    return []; // 失敗時回傳空陣列，避免網頁當掉
  }
};

// 2. 查詢場地佔用狀況 (對應 SELECT * FROM VENUE_BOOKING WHERE ...)
export const fetchVenueAvailability = async (date, venueId) => {
  try {
    // 透過 Query String 傳遞參數
    // 後端應該要有一個對應的 API 像是: GET /api/bookings?date=2025-11-28&venueId=v1
    const response = await fetch(`${API_BASE_URL}/bookings?date=${date}&venueId=${venueId}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    
    // 回傳後端給的真實資料
    // 假設後端回傳格式是 { bookedSlots: [13, 14] }
    return {
      venueId,
      date,
      bookedSlots: data.bookedSlots || [], 
      status: 'Available'
    };

  } catch (error) {
    console.error("無法查詢場地狀態:", error);
    // 發生錯誤時，回傳空陣列 (當作沒人借)，或你可以設計錯誤提示
    return {
      venueId,
      date,
      bookedSlots: [],
      status: 'Error' 
    };
  }
};