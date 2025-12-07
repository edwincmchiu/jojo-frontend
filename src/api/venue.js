// 定義後端 API 的基礎網址
const API_BASE_URL = '/api'; 

// 取得所有校內場地列表 (對應 SELECT * FROM VENUE)
export const fetchVenues = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/venues`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error("無法取得場地列表:", error);
    return [];
  }
};