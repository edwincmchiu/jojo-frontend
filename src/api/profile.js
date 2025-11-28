// [Mock API] 取得使用者個人資料與歷史紀錄
// 對應 SQL: SELECT * FROM USER WHERE User_id = ...
// 以及關聯的 USER_GROUP, PREFERENCE, EVENT, JOIN_RECORD

export const fetchUserProfile = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));

  return {
    id: 'u1',
    name: '趙仲文', // 
    email: 'b11705042@ntu.edu.tw', // 
    phone: '0912-345-678',
    avatar: '👨‍🎓',
    
    // 對應 USER_GROUP table 
    groups: [
      { id: 'g1', name: '資訊管理學系', type: 'Department' },
      { id: 'g2', name: '男一舍', type: 'Dorm' }
    ],

    // 對應 PREFERENCE table 
    interests: ['🏀 運動', '📚 讀書', '🍜 宵夜'],

    // 對應 EVENT (我主辦的) [cite: 13]
    hostedEvents: [
      { id: 'e1', title: '工數期中衝刺團', date: '2025/10/30', status: 'Closed', count: 4 }
    ],

    // 對應 JOIN_RECORD (我參加的) [cite: 14]
    joinedEvents: [
      { id: 'e2', title: '新生場打球缺 2', date: '2025/10/30', status: 'Open', count: 8 },
      { id: 'e5', title: '台大牛肉麵團', date: '2025/11/02', status: 'Cancelled', count: 3 }
    ]
  };
};