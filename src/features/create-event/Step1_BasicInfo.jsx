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
              className={`border rounded-xl p-3 flex flex-col items-center cursor-pointer transition-all ${formData.typeId === type.id ? 'ring-2 ring-brand-yellow bg-yellow-50 border-brand-yellow' : 'border-gray-200 hover:bg-gray-50'}`}
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