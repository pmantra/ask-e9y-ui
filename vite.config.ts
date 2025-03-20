import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['f767-174-165-47-196.ngrok-free.app', 'pug-firm-publicly.ngrok-free.app']
  }
})
