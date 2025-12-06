import { useState } from 'react';

export default function AdminLayout({ children, onLogout }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const adminName = localStorage.getItem('adminName') || '管理員';

  const menuItems = [
    { id: 'dashboard', label: '儀表板', icon: '📊' },
    { id: 'analytics', label: '數據分析', icon: '📈' },
    { id: 'types', label: '活動類型', icon: '🏷️' },
    { id: 'groups', label: '群組管理', icon: '👥' },
    { id: 'users', label: '使用者管理', icon: '👤' },
    { id: 'events', label: '活動管理', icon: '📅' },
  ];

  const handleLogout = () => {
    if (window.confirm('確定要登出嗎？')) {
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminName');
      onLogout();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 側邊欄 */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo 區 */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
              <span className="text-xl">🔐</span>
            </div>
            <div>
              <h1 className="text-lg font-bold">JoJo 管理後台</h1>
              <p className="text-xs text-gray-400">{adminName}</p>
            </div>
          </div>
        </div>

        {/* 選單 */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setCurrentPage(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-3 ${
                    currentPage === item.id
                      ? 'bg-yellow-400 text-gray-900 font-bold'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* 登出按鈕 */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            登出
          </button>
        </div>
      </aside>

      {/* 主要內容區 */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {children({ currentPage })}
        </div>
      </main>
    </div>
  );
}
