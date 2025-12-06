# JoJo 管理者後台 - Phase 1 實作完成

## 📁 檔案結構

```
jojo-backend/
├── db/pg/
│   └── create_admin_table.sql          # 管理者表 Schema
├── src/
    └── index.js                         # 後端 API（已新增管理者 API）

jojo-frontend/
├── src/
    ├── api/
    │   └── admin.js                     # 管理者 API 呼叫模組
    └── features/
        └── admin/
            ├── AdminApp.jsx             # 管理者主入口
            ├── AdminLogin.jsx           # 登入頁面
            ├── AdminLayout.jsx          # 後台佈局（側邊欄）
            ├── EventTypeManager.jsx     # 活動類型管理
            ├── GroupManager.jsx         # 群組管理
            ├── UserManager.jsx          # 使用者管理
            └── EventManager.jsx         # 活動管理
```

---

## 🚀 快速開始

### 1. 建立資料庫表

在 PostgreSQL 中執行：

```bash
cd jojo-backend
psql -U your_username -d your_database -f db/pg/create_admin_table.sql
```

或直接執行 SQL：

```sql
-- 建立管理者表
CREATE TABLE IF NOT EXISTS "ADMIN" (
    "Admin_id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) UNIQUE NOT NULL,
    "Password" VARCHAR(255) NOT NULL,
    "Name" VARCHAR(100) NOT NULL,
    "Email" VARCHAR(100),
    "Created_at" TIMESTAMP DEFAULT NOW()
);

-- 插入預設帳號
INSERT INTO "ADMIN" ("Username", "Password", "Name", "Email") 
VALUES ('admin', 'admin123', '系統管理員', 'admin@jojo.com')
ON CONFLICT ("Username") DO NOTHING;
```

### 2. 啟動後端

```bash
cd jojo-backend
npm install
npm start
```

後端將在 `http://localhost:3010` 運行。

### 3. 啟動前端

```bash
cd jojo-frontend
npm install
npm run dev
```

前端將在 `http://localhost:5173` 運行。

### 4. 訪問管理者後台

在瀏覽器中打開前端並導航到管理者頁面（需要在 App.jsx 或路由中配置）。

**預設登入資訊：**
- 帳號：`admin`
- 密碼：`admin123`

---

## 📋 功能說明

### 1. 管理者登入
- 使用獨立的 `ADMIN` 表進行身份驗證
- 登入後資訊存儲在 `localStorage`
- 支援登出功能

### 2. 活動類型管理
- **查看**：顯示所有活動類型及使用數量
- **新增**：新增自訂活動類型（如：共煮、桌遊）
- **刪除**：刪除未被使用的活動類型
- **防護**：如有活動使用該類型，無法刪除

### 3. 群組管理
- **查看**：顯示所有群組及成員/活動數量
- **新增**：建立新群組（如：撲克牌社）
- **刪除**：刪除群組及其成員關聯
- **防護**：如有活動限定該群組，無法刪除

### 4. 使用者管理
- **查看**：顯示所有使用者及統計資料
- **搜尋**：依姓名或信箱搜尋
- **統計**：顯示主辦/參與活動數量
- **刪除**：刪除使用者及其所有相關資料

### 5. 活動管理
- **查看**：顯示所有活動及詳細資訊
- **搜尋**：依標題或內容搜尋
- **篩選**：依活動類型篩選
- **統計**：顯示總活動數、參與人次等
- **刪除**：刪除活動及其報名紀錄

---

## 🔌 API 端點

### 管理者登入
- `POST /api/admin/login`
  - Body: `{ username, password }`
  - Response: `{ success, adminId, name }`

### 活動類型
- `GET /api/admin/event-types` - 取得所有類型
- `POST /api/admin/event-types` - 新增類型
  - Body: `{ typeName }`
- `DELETE /api/admin/event-types/:name` - 刪除類型

### 群組
- `GET /api/admin/groups` - 取得所有群組
- `POST /api/admin/groups` - 新增群組
  - Body: `{ groupName, description }`
- `DELETE /api/admin/groups/:id` - 刪除群組

### 使用者
- `GET /api/admin/users` - 取得所有使用者
- `DELETE /api/admin/users/:id` - 刪除使用者

### 活動
- `GET /api/admin/events` - 取得所有活動
- `DELETE /api/admin/events/:id` - 刪除活動

---

## 🎨 UI 設計特點

- **簡潔明瞭**：使用 Tailwind CSS 建立現代化介面
- **響應式設計**：支援不同螢幕尺寸
- **即時回饋**：操作後立即更新資料
- **錯誤處理**：使用 alert 提示錯誤訊息
- **資料統計**：各頁面均顯示相關統計數據

---

## 🔒 安全性考量

**當前實作（Demo 版本）：**
- 密碼明文儲存
- 使用 localStorage 儲存登入狀態
- 無 JWT Token 機制

**生產環境建議：**
1. 使用 bcrypt 雜湊密碼
2. 實作 JWT Token 機制
3. 新增 CSRF 保護
4. 實作 Session 管理
5. 新增操作日誌記錄

---

## 📊 資料庫關聯

管理者操作對資料庫的影響：

```
刪除使用者
├── DELETE FROM JOIN_RECORD (報名紀錄)
├── DELETE FROM USER_GROUP (群組成員)
├── DELETE FROM PREFERENCE (興趣偏好)
├── UPDATE EVENT SET Owner_id = NULL (活動擁有者)
└── DELETE FROM USER (使用者本身)

刪除群組
├── DELETE FROM USER_GROUP (成員關聯)
└── DELETE FROM GROUP (群組本身)

刪除活動
├── DELETE FROM JOIN_RECORD (報名紀錄)
├── DELETE FROM VENUE_BOOKING (場地預約)
└── DELETE FROM EVENT (活動本身)
```

---

## 🎯 下一步：Phase 2

準備實作：
- 統計分析 API（活動類型分布、群組參與度）
- 圖表視覺化（Recharts）
- 自訂時間範圍篩選
- 匯出報表功能

---

## 💡 使用範例

### 整合到 App.jsx

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminApp from './features/admin/AdminApp';
import EventFeed from './features/join-event/EventFeed';
// ...其他元件

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EventFeed />} />
        <Route path="/admin" element={<AdminApp />} />
        {/* ...其他路由 */}
      </Routes>
    </BrowserRouter>
  );
}
```

### 或直接在開發時測試

```jsx
// src/main.jsx
import AdminApp from './features/admin/AdminApp';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>
);
```

---

## 🐛 測試檢查清單

- [ ] 能成功登入管理者帳號
- [ ] 能新增和刪除活動類型
- [ ] 能新增和刪除群組
- [ ] 能查看和刪除使用者
- [ ] 能查看和刪除活動
- [ ] 刪除防護機制正常運作
- [ ] 搜尋功能正常
- [ ] 統計數據正確顯示
- [ ] 登出功能正常

---

**版本：Phase 1 - 核心功能**  
**建立日期：2025-12-06**  
**狀態：✅ 完成**
