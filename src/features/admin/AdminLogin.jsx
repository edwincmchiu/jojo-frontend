import { useState } from 'react';
import { adminLogin } from '../../api/admin';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await adminLogin(username, password);
      
      if (result.success) {
        // 儲存登入資訊到 localStorage
        localStorage.setItem('adminId', result.adminId);
        localStorage.setItem('adminName', result.name);
        
        // 通知父元件登入成功
        onLoginSuccess(result);
      }
    } catch (err) {
      setError(err.message || '登入失敗，請檢查帳號密碼');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo 區 */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔐</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">JoJo 管理後台</h1>
          <p className="text-gray-500 mt-2">請使用管理者帳號登入</p>
        </div>

        {/* 登入表單 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 錯誤訊息 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* 帳號輸入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              管理者帳號
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
              placeholder="請輸入帳號"
              required
            />
          </div>

          {/* 密碼輸入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              密碼
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition"
              placeholder="請輸入密碼"
              required
            />
          </div>

          {/* 登入按鈕 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>

        {/* 提示訊息 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>預設帳號：admin</p>
          <p>預設密碼：admin123</p>
        </div>
      </div>
    </div>
  );
}
