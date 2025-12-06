// src/App.jsx
import { useState } from 'react';
import CreateEventWizard from './features/create-event/CreateEventWizard';
import EventFeed from './features/join-event/EventFeed';
import UserProfile from './features/profile/UserProfile';
import LoginPage from './features/auth/LoginPage';
import AdminApp from './features/admin/AdminApp';

function App() {
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('feed');
  
  if (!user) {
    return <LoginPage onLogin={(userData) => setUser(userData)} />
  }

  // 如果是管理者，顯示管理者後台
  if (user.role === 'admin') {
    return <AdminApp onLogout={() => setUser(null)} />;
  }


  const navItems = [
    { id: 'feed', icon: '🔍', label: '找活動' },
    { id: 'create', icon: '➕', label: '開團' },
    { id: 'profile', icon: '👤', label: '我的' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 側邊導航欄 */}
      <aside className="w-64 bg-brand-dark text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold tracking-wider text-brand-yellow">JoJo 揪揪</h1>
          <p className="text-xs text-gray-400 mt-2">你好, {user.name}! 來揪團吧!</p>
        </div>
        
        <nav className="flex-1 p-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg mb-2 transition-all ${
                currentTab === item.id 
                  ? 'bg-brand-yellow text-brand-dark font-bold shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-base">{item.label}</span>
            </button>
          ))}
        </nav>

          <div className="p-4 border-t border-gray-700">
          <button 
            onClick={() => setUser(null)} // 清除 user 就會變回登入頁
            className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all"
          >
            <span>🚪</span>
            <span>登出</span>
          </button>
          <div className="mt-4 text-center text-xs text-gray-600">
            © 2025 JoJo 揪揪
          </div>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 overflow-auto">
        {currentTab === 'feed' && <EventFeed />}
        {currentTab === 'create' && (
          <div className="p-8">
            <CreateEventWizard onSuccess={() => setCurrentTab('feed')} />
          </div>
        )}
        {currentTab === 'profile' && <UserProfile userId={user.id} />}
      </main>
    </div>
  );
}

export default App;