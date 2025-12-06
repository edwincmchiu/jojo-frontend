import { useState } from 'react';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // --- 模擬登入 API ---
    // 這裡之後可以換成真正的 fetch('/api/login')
    setTimeout(() => {
      // 假設登入成功，回傳使用者資料
      // 這裡 ID 寫死為 1，對應你資料庫的趙仲文
      const mockUser = { 
        id: 1, 
        name: formData.username || '趙仲文', 
        role: 'student' 
      };
      
      setLoading(false);
      onLogin(mockUser); // 通知 App.jsx 登入成功
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">JoJo 揪揪</h1>
          <p className="text-gray-500">登入以開始你的校園生活</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">帳號 / 學號</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              placeholder="請輸入帳號"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          <p>Demo 帳號：任意輸入即可登入</p>
        </div>
      </div>
    </div>
  );
}