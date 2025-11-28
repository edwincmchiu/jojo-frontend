// [Mock API] 模擬從後端資料庫取得場地資訊
// 對應資料庫表: VENUE, VENUE_BOOKING

export const fetchVenueAvailability = async (date, venueId) => {
  console.log(`[DB Query] SELECT * FROM VENUE_BOOKING WHERE date='${date}' AND venue_id='${venueId}'`);
  
  // 模擬網路延遲
  await new Promise(resolve => setTimeout(resolve, 600));

  // 模擬回傳資料: 下午 13:00, 14:00, 18:00 已被預約
  return {
    venueId,
    date,
    bookedSlots: [13, 14, 18], 
    status: 'Available'
  };
};

export const fetchVenues = async () => {
    // 模擬 SELECT * FROM VENUE WHERE Status = 'Available'
    return [
        { id: 'v1', name: '二活 303', capacity: 10 },
        { id: 'v2', name: '新生 102', capacity: 40 },
        { id: 'v3', name: '舊體育館 羽球場A', capacity: 6 },
    ];
}