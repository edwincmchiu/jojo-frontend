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
                                      className={`py-2 rounded text-sm font-medium border transition-all ${
                                          isBooked 
                                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                                          : isSelected
                                              ? 'bg-brand-yellow border-brand-yellow text-brand-dark ring-2 ring-brand-yellow/50'
                                              : 'bg-white border-gray-300 hover:border-brand-yellow'
                                      }`}
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