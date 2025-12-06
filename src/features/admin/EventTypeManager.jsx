import { useState, useEffect } from 'react';
import { fetchEventTypes, addEventType, deleteEventType } from '../../api/admin';

export default function EventTypeManager() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTypeName, setNewTypeName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    setLoading(true);
    const data = await fetchEventTypes();
    setTypes(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newTypeName.trim()) {
      alert('請輸入類型名稱');
      return;
    }

    setIsAdding(true);
    try {
      await addEventType(newTypeName.trim());
      alert('新增成功！');
      setNewTypeName('');
      loadTypes();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (typeName) => {
    if (!window.confirm(`確定要刪除「${typeName}」類型嗎？`)) return;

    try {
      await deleteEventType(typeName);
      alert('刪除成功！');
      loadTypes();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">活動類型管理</h2>

      {/* 新增區域 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">新增活動類型</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            placeholder="輸入類型名稱，例如：共煮、桌遊"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition disabled:opacity-50"
          >
            {isAdding ? '新增中...' : '新增'}
          </button>
        </div>
      </div>

      {/* 列表區域 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">現有活動類型</h3>
          <p className="text-sm text-gray-500 mt-1">共 {types.length} 種類型</p>
        </div>

        <div className="divide-y divide-gray-200">
          {types.map((type) => (
            <div key={type.Type_name} className="p-6 flex items-center justify-between hover:bg-gray-50 transition">
              <div>
                <h4 className="font-bold text-gray-800 text-lg">{type.Type_name}</h4>
                <p className="text-sm text-gray-500 mt-1">
                  {type.event_count} 個活動使用此類型
                </p>
              </div>
              <button
                onClick={() => handleDelete(type.Type_name)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
              >
                刪除
              </button>
            </div>
          ))}

          {types.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              目前沒有活動類型
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
