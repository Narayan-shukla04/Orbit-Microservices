import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const API_GATEWAY_URL = process.env.VITE_API_GATEWAY_URL || 'http://localhost:3000'
const MESSAGING_URL = process.env.VITE_MESSAGING_URL || 'http://localhost:3004'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: API_GATEWAY_URL,
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: MESSAGING_URL,
        ws: true,
        changeOrigin: true,
      },
    },
  },
})
