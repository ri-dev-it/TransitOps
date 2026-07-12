import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Forwards all /api requests to your backend
      '/api': {
        target: 'http://localhost:5000', // <--- Change 5000 if your backend runs on a different port!
        changeOrigin: true,
      }
    }
  }
})