import { useState, useEffect } from 'react';
import { fetchEventTypes } from '../../api/admin';

export default function Step1BasicInfo({ formData, setFormData }) {
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventTypes().then(types => {
      setActivityTypes(types.map(t => ({ id: t.type_name, name: t.type_name })));
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load event types:', err);
      setLoading(false);
    });
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="animate-fade-in space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">想揪什麼？</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          活動標題
        </label>
        <input 
          name="title" 
          value={formData.title} 
          onChange={handleChange}
          placeholder="例如：期中考計算機結構讀書會" 
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-brand-yellow focus:ring-2 focus:ring-brand-yellow/50 outline-none transition-all"
          required
        />
        {!formData.title && (
          <p className="text-xs text-gray-400 mt-1">請輸入活動標題才能繼續</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          活動類型
        </label>
        <div className="grid grid-cols-2 gap-3">
          {loading ? (
            <div className="col-span-2 text-center text-gray-400 py-4">載入中...</div>
          ) : (
            activityTypes.map(type => (
              <div 
                key={type.id}
                onClick={() => setFormData({...formData, typeId: type.id})}
                className={`border rounded-xl p-3 flex items-center justify-center cursor-pointer transition-all ${formData.typeId === type.id ? 'ring-2 ring-brand-yellow bg-yellow-50 border-brand-yellow' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <span className="text-sm font-medium text-gray-700">{type.name}</span>
              </div>
            ))
          )}
        </div>
        {!formData.typeId && (
          <p className="text-xs text-gray-400 mt-2">請選擇活動類型才能繼續</p>
        )}
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