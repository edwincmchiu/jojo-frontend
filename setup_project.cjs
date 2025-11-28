// setup_project.js
// 這是一個用來自動生成 JoJo 專案架構與程式碼的腳本
const fs = require('fs');
const path = require('path');

// 定義要建立的目錄結構
const directories = [
  'src/api',
  'src/components/ui',
  'src/components/layout',
  'src/features/create-event',
  'src/utils',
];

// 定義要寫入的檔案內容
const files = {
  // 1. Tailwind Config
  'tailwind.config.js': `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#FCD34D', // JoJo 主色
          dark: '#1F2937',   // 深色背景
        }
      }
    },
  },
  plugins: [],
}
`,

  // 2. CSS Reset
  'src/index.css': `
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定義動畫 */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
`,

  // 3. API Mock (Venue)
  'src/api/venue.js': `
// [Mock API] 模擬從後端資料庫取得場地資訊
// 對應資料庫表: VENUE, VENUE_BOOKING

export const fetchVenueAvailability = async (date, venueId) => {
  console.log(\`[DB Query] SELECT * FROM VENUE_BOOKING WHERE date='\${date}' AND venue_id='\${venueId}'\`);
  
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
`,

  // 4. API Mock (Event)
  'src/api/event.js': `
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
`,

  // 5. Utility
  'src/utils/time.js': `
export const formatTime = (hour) => {
  return \`\${hour}:00\`;
};
`,

  // 6. Components - UI
  'src/components/ui/Button.jsx': `
import classNames from 'classnames';

export default function Button({ children, variant = 'primary', className, ...props }) {
  const baseStyle = "w-full py-3 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2";
  const variants = {
    primary: "bg-brand-dark text-white hover:bg-gray-800",
    secondary: "bg-gray-100 text-gray-600 hover:bg-gray-200",
    action: "bg-brand-yellow text-brand-dark hover:brightness-105"
  };

  return (
    <button className={classNames(baseStyle, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
`,

  // 7. Layout - Header
  'src/components/layout/Header.jsx': `
export default function Header({ currentStep }) {
  const steps = ['基本', '限制', '時間'];
  
  return (
    <div className="bg-brand-dark text-white p-6 rounded-b-3xl shadow-md z-10">
      <div className="flex justify-between items-center mb-6">
        <button className="text-gray-400 hover:text-white">&lt; 返回</button>
        <h1 className="text-xl font-bold tracking-wider text-brand-yellow">JoJo 揪揪</h1>
        <div className="w-8"></div>
      </div>
      
      {/* 進度條 */}
      <div className="flex items-center justify-between px-2">
        {steps.map((label, idx) => {
          const stepNum = idx + 1;
          const isActive = stepNum <= currentStep;
          const isLineActive = currentStep > stepNum;
          
          return (
            <div key={idx} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center relative z-10">
                <div className={\`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 \${isActive ? 'bg-brand-yellow text-brand-dark' : 'bg-gray-600 text-white'}\`}>
                  {stepNum}
                </div>
                <span className="text-xs mt-1 text-gray-300 absolute top-8 w-max">{label}</span>
              </div>
              {idx < steps.length - 1 && (
                <div className="h-1 flex-1 mx-2 bg-gray-600 rounded">
                  <div className={\`h-full bg-brand-yellow transition-all duration-500 ease-out \${isLineActive ? 'w-full' : 'w-0'}\`}></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
`,

  // 8. Feature - Step 1
  'src/features/create-event/Step1_BasicInfo.jsx': `
const ACTIVITY_TYPES = [
  { id: 't1', name: '宵夜', icon: '🍜' },
  { id: 't2', name: '運動', icon: '🏀' },
  { id: 't3', name: '讀書', icon: '📚' },
  { id: 't4', name: '出遊', icon: '🚗' },
  { id: 't5', name: '其他', icon: '✨' }
];

export default function Step1BasicInfo({ formData, setFormData }) {
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">想揪什麼？</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">活動標題</label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange}
          placeholder="例如：期中考計算機結構讀書會" 
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">活動類型</label>
        <div className="grid grid-cols-2 gap-3">
          {ACTIVITY_TYPES.map(type => (
            <div 
              key={type.id}
              onClick={() => setFormData({...formData, typeId: type.id})}
              className={\`border rounded-xl p-3 flex flex-col items-center cursor-pointer transition-all \${formData.typeId === type.id ? 'ring-2 ring-brand-yellow bg-yellow-50 border-brand-yellow' : 'border-gray-200 hover:bg-gray-50'}\`}
            >
              <span className="text-2xl mb-1">{type.icon}</span>
              <span className="text-sm font-medium text-gray-700">{type.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">內容描述</label>
        <textarea 
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="4" 
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all"
        ></textarea>
      </div>
    </div>
  );
}
`,

  // 9. Feature - Step 2
  'src/features/create-event/Step2_Audience.jsx': `
export default function Step2Audience({ formData, setFormData }) {
  const adjustCapacity = (delta) => {
    setFormData(prev => ({
        ...prev,
        capacity: Math.max(2, prev.capacity + delta)
    }));
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">找誰參加？</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">人數上限</label>
        <div className="flex items-center space-x-4">
          <button onClick={() => adjustCapacity(-1)} className="w-12 h-12 rounded-full bg-gray-100 text-2xl font-bold hover:bg-gray-200">-</button>
          <span className="w-20 text-center text-2xl font-bold">{formData.capacity}</span>
          <button onClick={() => adjustCapacity(1)} className="w-12 h-12 rounded-full bg-brand-yellow text-brand-dark text-2xl font-bold shadow-md hover:brightness-110">+</button>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">限定群組</label>
        <select 
          value={formData.groupId || ''}
          onChange={(e) => setFormData({...formData, groupId: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none"
        >
          <option value="">🌏 公開活動 (不限)</option>
          <option value="g1">💻 資訊工程學系</option>
          <option value="g2">🏠 男一舍</option>
          <option value="g3">🧗 登山社</option>
        </select>
      </div>
    </div>
  );
}
`,

  // 10. Feature - Step 3 (The complex one)
  'src/features/create-event/Step3_VenueBooking.jsx': `
import { useState, useEffect } from 'react';
import { fetchVenueAvailability, fetchVenues } from '../../api/venue';

export default function Step3VenueBooking({ formData, setFormData }) {
  const [venues, setVenues] = useState([]);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // 初始化場地列表
  useEffect(() => {
    fetchVenues().then(data => {
        setVenues(data);
        if (!formData.venueId && data.length > 0) {
            setFormData(prev => ({ ...prev, venueId: data[0].id }));
        }
    });
  }, []);

  // 當場地或日期改變時，查詢狀態
  useEffect(() => {
    if (formData.needBook && formData.venueId) {
      setLoading(true);
      fetchVenueAvailability(formData.date, formData.venueId)
        .then(data => {
          setBookedSlots(data.bookedSlots);
          setLoading(false);
        });
    }
  }, [formData.needBook, formData.venueId, formData.date]);

  const toggleSlot = (hour) => {
      // 這裡可以加入「連續三小時」的邏輯檢查
      const currentSlots = formData.selectedSlots || [];
      if (currentSlots.includes(hour)) {
          setFormData(prev => ({ ...prev, selectedSlots: currentSlots.filter(h => h !== hour) }));
      } else {
          setFormData(prev => ({ ...prev, selectedSlots: [...currentSlots, hour].sort() }));
      }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">何時何地？</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
        <input 
          type="date" 
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50"
        />
      </div>

      {/* Toggle */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <span className="font-bold text-gray-800">需借用校內場地</span>
          <p className="text-xs text-gray-500">對應 Need_book = True</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={formData.needBook}
            onChange={(e) => setFormData({...formData, needBook: e.target.checked})}
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-dark"></div>
        </label>
      </div>

      {/* 場地選擇與時間軸 */}
      {formData.needBook ? (
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">選擇場地 (VENUE)</label>
                  <select 
                      value={formData.venueId}
                      onChange={(e) => setFormData({...formData, venueId: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none"
                  >
                      {venues.map(v => (
                          <option key={v.id} value={v.id}>{v.name} (容納: {v.capacity}人)</option>
                      ))}
                  </select>
              </div>

              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">查詢時段 (VENUE_BOOKING)</label>
                  {loading ? (
                      <div className="text-sm text-gray-500 animate-pulse">正在查詢資料庫...</div>
                  ) : (
                      <div className="grid grid-cols-4 gap-2">
                          {[8,9,10,11,12,13,14,15,16,17,18,19,20].map(hour => {
                              const isBooked = bookedSlots.includes(hour);
                              const isSelected = formData.selectedSlots?.includes(hour);
                              
                              return (
                                  <button
                                      key={hour}
                                      disabled={isBooked}
                                      onClick={() => toggleSlot(hour)}
                                      className={\`py-2 rounded text-sm font-medium border transition-all \${
                                          isBooked 
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                          : isSelected
                                              ? 'bg-brand-yellow border-brand-yellow text-brand-dark ring-2 ring-brand-yellow/50'
                                              : 'bg-white border-gray-300 hover:border-brand-yellow'
                                      }\`}
                                  >
                                      {hour}:00
                                  </button>
                              );
                          })}
                      </div>
                  )}
                  <p className="text-xs text-orange-500 mt-2">* 灰色為已被預約 (Status check)</p>
              </div>
          </div>
      ) : (
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">自訂地點</label>
             <input placeholder="例如：總圖 B1 自習室區" className="w-full px-4 py-3 rounded-xl border border-gray-200"/>
          </div>
      )}
    </div>
  );
}
`,

  // 11. Wizard Controller
  'src/features/create-event/CreateEventWizard.jsx': `
import { useState } from 'react';
import Header from '../../components/layout/Header';
import Button from '../../components/ui/Button';
import Step1BasicInfo from './Step1_BasicInfo';
import Step2Audience from './Step2_Audience';
import Step3VenueBooking from './Step3_VenueBooking';
import { createEvent } from '../../api/event';

export default function CreateEventWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 核心 State: 對應 DB 的 EVENT table schema
  const [formData, setFormData] = useState({
    title: '',
    typeId: '',     // FK: TYPE
    content: '',
    capacity: 4,
    groupId: '',    // FK: GROUP (nullable)
    needBook: false,
    venueId: '',    // FK: VENUE
    date: new Date().toISOString().split('T')[0],
    selectedSlots: [] // Logic for booking
  });

  const nextStep = async () => {
    if (currentStep < 3) {
      setCurrentStep(c => c + 1);
    } else {
      // Submit Logic
      setIsSubmitting(true);
      await createEvent(formData);
      setIsSubmitting(false);
      alert('活動建立成功！\\n資料已寫入資料庫。');
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(c => c - 1);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden min-h-[800px] flex flex-col relative font-sans text-brand-dark">
      <Header currentStep={currentStep} />

      <div className="flex-1 p-6 overflow-y-auto">
        {currentStep === 1 && <Step1BasicInfo formData={formData} setFormData={setFormData} />}
        {currentStep === 2 && <Step2Audience formData={formData} setFormData={setFormData} />}
        {currentStep === 3 && <Step3VenueBooking formData={formData} setFormData={setFormData} />}
      </div>

      <div className="p-6 border-t border-gray-100 bg-white">
        <Button variant={currentStep === 3 ? 'action' : 'primary'} onClick={nextStep} disabled={isSubmitting}>
          {isSubmitting ? '處理中...' : (currentStep === 3 ? '確認發布' : '下一步')}
        </Button>
        {currentStep > 1 && (
          <Button variant="secondary" className="mt-3" onClick={prevStep}>
            返回上一步
          </Button>
        )}
      </div>
    </div>
  );
}
`,

  // 12. App Entry
  'src/App.jsx': `
import CreateEventWizard from './features/create-event/CreateEventWizard';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
      <CreateEventWizard />
    </div>
  );
}

export default App;
`
};

// 執行目錄建立
console.log('正在建立目錄結構...');
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log('Created:', dir);
  }
});

// 執行檔案寫入
console.log('正在寫入程式碼...');
Object.entries(files).forEach(([filePath, content]) => {
  const fullPath = path.join(__dirname, filePath);
  fs.writeFileSync(fullPath, content.trim(), 'utf8');
  console.log('Written:', filePath);
});

console.log('✅ 專案建置完成！請執行 npm run dev');