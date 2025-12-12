import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy para la API de métricas (evita CORS en desarrollo)
      '/api': {
        target: 'http://172.105.21.15:3010',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
