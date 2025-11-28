// src/components/layout/BottomNav.jsx
export default function BottomNav({ currentTab, setTab }) {
  const navs = [
    { id: 'feed', icon: '🔍', label: '找活動' },
    { id: 'create', icon: '➕', label: '開團' },
    { id: 'profile', icon: '👤', label: '我的' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 pb-6 max-w-md mx-auto">
      {navs.map(n => (
        <button key={n.id} onClick={() => setTab(n.id)} className={`flex flex-col items-center gap-1 transition-all ${currentTab === n.id ? 'text-brand-dark scale-105' : 'text-gray-300'}`}>
          <div className={`text-2xl ${n.id === 'create' ? 'bg-brand-yellow text-brand-dark w-12 h-12 flex items-center justify-center rounded-full shadow-lg -mt-5 border-4 border-white' : ''}`}>
            {n.icon}
          </div>
          {n.id !== 'create' && <span className="text-[10px] font-bold">{n.label}</span>}
        </button>
      ))}
    </div>
  );
}