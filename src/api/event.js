// [Mock API] 建立活動
// 對應資料庫操作: INSERT INTO EVENT, INSERT INTO VENUE_BOOKING

export const createEvent = async (eventData) => {
  console.log('[DB Transaction] BEGIN TRANSACTION');
  console.log('[DB Insert] INSERT INTO EVENT ...', eventData);
  
  if (eventData.needBook) {
      console.log('[DB Insert] INSERT INTO VENUE_BOOKING ...');
  }

  await new Promise(resolve => setTimeout(resolve, 1000));
  console.log('[DB Transaction] COMMIT');
  
  return { success: true, eventId: 'evt_' + Date.now() };
};