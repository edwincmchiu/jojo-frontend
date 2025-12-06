import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // 或是 '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // [新增] 設定代理
    proxy: {
      // 只要網址是 /api 開頭的，都轉發給後端 3010
      '/api': {
        target: 'http://localhost:3010',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})