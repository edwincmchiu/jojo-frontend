import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sex: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 前端驗證
    if (formData.password !== formData.confirmPassword) {
      setError('密碼與確認密碼不一致');
      setLoading(false);
      return;
    }

    if (!formData.email.endsWith('@ntu.edu.tw')) {
      setError('Email 必須是 ntu.edu.tw 結尾');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          sex: formData.sex,
          password: formData.password,
          phone: formData.phone
        })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `註冊失敗 (${response.status})`);
      }

      const data = await response.json();
      alert('註冊成功！請使用您的 Email 和密碼登入');
      navigate('/login');
    } catch (err) {
      setError(err.message || '註冊時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-dark mb-2">註冊新帳號</h1>
          <p className="text-gray-500">加入 JoJo 揪揪開始你的校園生活</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              placeholder="請輸入您的姓名"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              placeholder="example@ntu.edu.tw"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <p className="text-xs text-gray-500 mt-1">必須使用 ntu.edu.tw 結尾的 Email</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">性別 *</label>
            <select
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              value={formData.sex}
              onChange={(e) => setFormData({...formData, sex: e.target.value})}
            >
              <option value="">請選擇性別</option>
              <option value="Male">男</option>
              <option value="Female">女</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">電話 *</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              placeholder="0912345678"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">密碼 *</label>
            <input
              type="password"
              required
              minLength="6"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              placeholder="至少 6 個字元"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">確認密碼 *</label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-brand-yellow/50 outline-none"
              placeholder="請再次輸入密碼"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 mt-6"
          >
            {loading ? '註冊中...' : '註冊'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            返回登入
          </button>
        </form>
      </div>
    </div>
  );
}
