import { useState, useEffect } from 'react';
import { fetchVenues } from '../../api/venue';

export default function Step3VenueBooking({ formData, setFormData }) {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);

  // 當選擇校內場地時，查詢可用場地列表
  useEffect(() => {
    if (formData.isOnCampus) {
      setLoading(true);
      fetchVenues().then(data => {
        setVenues(data);
        // 如果還沒選場地且有資料，預設選第一個
        if (!formData.venueId && data.length > 0) {
          setFormData(prev => ({ ...prev, venueId: data[0].id }));
        }
        setLoading(false);
      });
    }
  }, [formData.isOnCampus]);

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">何時何地？</h2>

      {/* 日期選擇 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
        <input 
          type="date" 
          value={formData.date}
          onChange={(e) => setFormData({...formData, date: e.target.value})}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all"
        />
      </div>

      {/* 校內/校外切換按鈕 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">場地類型</label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setFormData({...formData, isOnCampus: true, locationName: ''})}
            className={`p-4 rounded-xl border-2 transition-all ${
              formData.isOnCampus
                ? 'border-brand-yellow bg-yellow-50 ring-2 ring-brand-yellow/50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">🏫</div>
            <div className="font-bold text-gray-800">校內場地</div>
            <div className="text-xs text-gray-500 mt-1">需選擇可用場地</div>
          </button>

          <button
            type="button"
            onClick={() => setFormData({...formData, isOnCampus: false, venueId: ''})}
            className={`p-4 rounded-xl border-2 transition-all ${
              !formData.isOnCampus
                ? 'border-brand-yellow bg-yellow-50 ring-2 ring-brand-yellow/50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-3xl mb-2">🌍</div>
            <div className="font-bold text-gray-800">校外場地</div>
            <div className="text-xs text-gray-500 mt-1">自訂地點名稱</div>
          </button>
        </div>
      </div>

      {/* 根據選擇顯示對應輸入框 */}
      {formData.isOnCampus ? (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">選擇校內場地</label>
          <p className="text-sm text-amber-600 mb-3 font-bold">
             ⚠️ 注意：本系統僅供揪團媒合，不具備場地借用功能，請務必自行向學校申請。
          </p>
          
          {loading ? (
            <div className="text-sm text-gray-500 animate-pulse">載入場地列表...</div>
          ) : (
            <select 
              value={formData.venueId}
              onChange={(e) => setFormData({...formData, venueId: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all"
            >
              {venues.length === 0 ? (
                <option value="">無可用場地</option>
              ) : (
                venues.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name} (容納 {v.capacity} 人)
                  </option>
                ))
              )}
            </select>
          )}

          {/* 🔥 新增的紅色警示框 (只有在選擇了場地後才顯示) */}
          {formData.venueId && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 animate-fade-in">
              <div className="text-2xl">⚠️</div>
              <div>
                <h4 className="font-bold text-red-600 mb-1">重要提醒</h4>
                <p className="text-sm text-red-500 leading-relaxed">
                  此系統僅協助媒合同學參加活動，<span className="font-bold underline">無法自動向學校借用場地</span>。
                  <br/>
                  發布活動前，請您務必先自行向場地管理單位確認借用狀況。
                </p>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">💡 場地資料來自資料庫 VENUE 表</p>
        </div>
      ) : (
        /* 校外場地：輸入地點名稱 */
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">地點名稱</label>
          <input 
            type="text"
            value={formData.locationName}
            onChange={(e) => setFormData({...formData, locationName: e.target.value})}
            placeholder="例如：台大總圖 B1、師大夜市麥當勞" 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all"
          />
        </div>
      )}
    </div>
  );
}