// src/App.jsx
import { useState } from 'react';
import CreateEventWizard from './features/create-event/CreateEventWizard';
import EventFeed from './features/join-event/EventFeed';
import UserProfile from './features/profile/UserProfile';

function App() {
  const [currentTab, setCurrentTab] = useState('feed');

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
          <p className="text-xs text-gray-400 mt-2">即時媒合校園生活夥伴</p>
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

        <div className="p-6 border-t border-gray-700 text-xs text-gray-400">
          <p>© 2025 JoJo 揪揪</p>
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
        {currentTab === 'profile' && <UserProfile />}
      </main>
    </div>
  );
}

export default App;