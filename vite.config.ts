import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        // Ignore TypeScript errors during build
        if (warning.code && warning.code.includes('TS')) {
          return;
        }
        warn(warning);
      }
    }
  }
})