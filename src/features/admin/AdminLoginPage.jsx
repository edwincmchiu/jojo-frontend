import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminLoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `登入失敗 (${response.status})`);
      }

      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.admin));
      onLogin(data.admin);
    } catch (err) {
      setError(err.message || '登入時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🔒 管理者登入</h1>
          <p className="text-gray-400">JoJo 揪揪後台管理系統</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">管理者帳號</label>
            <input
              type="text"
              required
              maxLength="10"
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="請輸入帳號"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">密碼</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="請輸入密碼"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 mt-6"
          >
            {loading ? '登入中...' : '登入'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/register')}
            className="w-full bg-gray-700 text-gray-200 py-3 rounded-xl font-medium hover:bg-gray-600 transition-all"
          >
            註冊管理者帳號
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-transparent text-gray-400 py-2 rounded-xl font-medium hover:text-gray-200 transition-all"
          >
            ← 返回一般登入
          </button>
        </form>
      </div>
    </div>
  );
}
