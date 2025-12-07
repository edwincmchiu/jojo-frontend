import { useState, useEffect } from 'react';
import { fetchGroups } from '../../api/admin';

export default function Step2Audience({ formData, setFormData }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGroups().then(data => {
      setGroups(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load groups:', err);
      setLoading(false);
    });
  }, []);

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
          disabled={loading}
        >
          <option value="">公開活動 (不限)</option>
          {groups.map(group => (
            <option key={group.group_id} value={group.group_id}>
              {group.group_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}