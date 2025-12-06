import { useState } from 'react';
import { adminLogin } from '../../api/admin';

export default function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 模擬載入延遲
    setTimeout(() => {
      // 檢查是否為管理者登入（前端驗證，不連後端）
      if (formData.username === 'admin' && formData.password === 'admin123') {
        // 管理者登入成功
        const adminUser = {
          id: 999,
          name: '系統管理員',
          role: 'admin'
        };
        
        setLoading(false);
        onLogin(adminUser);
        return;
      }

      // 一般使用者登入（模擬）
      const mockUser = { 
        id: 1, 
        name: formData.username || '趙仲文', 
        role: 'student' 
      };
      
      setLoading(false);
      onLogin(mockUser);
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">JoJo 揪揪</h1>
          <p className="text-gray-500">登入以開始你的校園生活</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 錯誤訊息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

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
          <p>一般使用者：任意輸入即可登入</p>
          <p className="mt-1">管理者帳號：admin / admin123</p>
        </div>
      </div>
    </div>
  );
}