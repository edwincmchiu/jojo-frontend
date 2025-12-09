import { useState, useEffect } from 'react';
import { fetchGroups, addGroup, deleteGroup } from '../../api/admin';

export default function GroupManager() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGroupName, setNewGroupName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    const data = await fetchGroups();
    setGroups(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!newGroupName.trim()) {
      alert('請輸入群組名稱');
      return;
    }

    setIsAdding(true);
    try {
      await addGroup(newGroupName.trim());
      alert('新增成功！');
      setNewGroupName('');
      loadGroups();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (groupId, groupName) => {
    if (!window.confirm(`確定要刪除「${groupName}」群組嗎？`)) return;

    try {
      await deleteGroup(groupId);
      alert('刪除成功！');
      loadGroups();
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">群組管理</h2>

      {/* 新增區域 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">新增群組</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            placeholder="群組名稱，例如：撲克牌社、電影同好會"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold rounded-lg transition disabled:opacity-50"
          >
            {isAdding ? '新增中...' : '新增群組'}
          </button>
        </div>
      </div>

      {/* 列表區域 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">現有群組</h3>
          <p className="text-sm text-gray-500 mt-1">共 {groups.length} 個群組</p>
        </div>

        <div className="divide-y divide-gray-200">
          {groups.map((group) => (
            <div key={group.group_id} className="p-6 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-bold text-gray-800 text-lg">{group.name}</h4>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded">
                      {group.category}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>👥 {group.member_count} 位成員</span>
                    <span>📅 {group.event_count} 個活動</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(group.group_id, group.name)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
                >
                  刪除
                </button>
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              目前沒有群組
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
