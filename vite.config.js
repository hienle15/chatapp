import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',     // 👈 Cho phép truy cập từ IP trong mạng LAN
    port: 5173,          // 👈 Cổng mong muốn (nếu cần)
  },
  preview: {
    host: '0.0.0.0',  // 👈 BẮT BUỘC để Railway truy cập được
    port: parseInt(process.env.PORT) || 4173, // Railway sẽ cung cấp biến PORT
  }
})
