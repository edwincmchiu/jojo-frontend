import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css' // [關鍵] 這裡必須引入包含 Tailwind 指令的 CSS 檔

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)