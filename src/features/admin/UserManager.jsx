import { useState, useEffect } from 'react';
import { fetchUsers, deleteUser } from '../../api/admin';

export default function UserManager() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 100;

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await fetchUsers();
    setUsers(data);
    setLoading(false);
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`確定要刪除使用者「${userName}」嗎？\n此操作將同時刪除該使用者的所有相關資料。`)) {
      return;
    }

    try {
      await deleteUser(userId);
      alert('刪除成功！');
      loadUsers();
    } catch (error) {
      alert(error.message);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">載入中...</div>;
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">使用者管理</h2>

      {/* 搜尋區域 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="搜尋使用者（姓名或信箱）"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 outline-none"
        />
      </div>

      {/* 統計資訊 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-800">{users.length}</div>
            <div className="text-sm text-gray-500 mt-1">總使用者數</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {users.reduce((sum, u) => sum + parseInt(u.hosted_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">總主辦活動數</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-800">
              {users.reduce((sum, u) => sum + parseInt(u.joined_count || 0), 0)}
            </div>
            <div className="text-sm text-gray-500 mt-1">總參與次數</div>
          </div>
        </div>
      </div>

      {/* 列表區域 */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">使用者列表</h3>
              <p className="text-sm text-gray-500 mt-1">
                顯示 {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} / {filteredUsers.length} 位使用者 (第 {currentPage}/{totalPages} 頁)
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                ← 上一頁
              </button>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                下一頁 →
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">信箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">性別</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">主辦</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">參與</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{user.user_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.sex === 'Male' ? '男' : '女'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.hosted_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joined_count}</td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDelete(user.user_id, user.name)}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition"
                    >
                      刪除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="p-10 text-center text-gray-400">
              {searchTerm ? '找不到符合的使用者' : '目前沒有使用者'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
