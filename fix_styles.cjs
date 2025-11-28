// fix_styles.cjs
const fs = require('fs');
const path = require('path');

// 1. 強制建立 PostCSS 設定 (這是 Tailwind 運作的核心)
// 使用 .cjs 副檔名以避免與專案的 "type": "module" 衝突
const postcssConfig = `
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;

// 2. 確保 main.jsx 正確引入了 index.css
const mainJsx = `
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // [關鍵] 這裡必須引入包含 Tailwind 指令的 CSS 檔

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
`;

// 寫入檔案
console.log('正在修復樣式設定...');

fs.writeFileSync(path.join(__dirname, 'postcss.config.cjs'), postcssConfig.trim());
console.log('✅ 已建立 postcss.config.cjs');

// 刪除舊的 (如果存在)，避免衝突
if (fs.existsSync(path.join(__dirname, 'postcss.config.js'))) {
    fs.unlinkSync(path.join(__dirname, 'postcss.config.js'));
    console.log('🗑️  已移除舊的 postcss.config.js');
}

fs.writeFileSync(path.join(__dirname, 'src/main.jsx'), mainJsx.trim());
console.log('✅ 已更新 src/main.jsx (確保引入 index.css)');

console.log('🚀 修復完成！請重新啟動伺服器。');