import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: '0.0.0.0',      // ← allow external access
    port: 5173,           // optional: default port
    strictPort: true,     // optional: prevent port fallback
  },
})
