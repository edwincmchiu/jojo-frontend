// src/api/feed.js
export const fetchEventFeed = async () => {
  // 模擬網路延遲
  await new Promise(resolve => setTimeout(resolve, 500));

  // 這就是你希望後端吐給你的 JSON 格式 (API Contract)
  return [
    {
      id: 'e1',
      title: '工數期中衝刺團',
      type: '讀書',
      icon: '📚',
      content: '徵求戰友一起刷考古題，目前有兩人，預計刷 105-110 年。',
      location: '總圖 B1 自習室',
      startTime: '10/30 13:00',
      endTime: '16:00',
      currentPeople: 2,
      capacity: 4,
      hostName: '趙同學',
      isGroupLimit: false // 公開活動
    },
    {
      id: 'e2',
      title: '新生場打球缺 2',
      type: '運動',
      icon: '🏀',
      content: '打全場，缺後衛，程度普普歡樂打。',
      location: '新生高架籃球場',
      startTime: '今晚 19:00',
      endTime: '21:00',
      currentPeople: 9,
      capacity: 10, // 模擬快滿了
      hostName: '江同學',
      isGroupLimit: false
    },
    {
      id: 'e3',
      title: '資工系計算機網路讀書會',
      type: '讀書',
      icon: '💻',
      content: '討論 Socket Programming 作業，限系上同學。',
      location: '德田館 202',
      startTime: '明天 10:00',
      endTime: '12:00',
      currentPeople: 3,
      capacity: 6,
      hostName: '洪同學',
      isGroupLimit: true, // 系所限定
      groupName: '資訊工程學系'
    }
  ];
};

export const joinEvent = async (eventId) => {
  // 模擬 INSERT INTO JOIN_RECORD
  console.log(`[API] User joined event ${eventId}`);
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true };
};