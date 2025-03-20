import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // Skip type checking during build
    emptyOutDir: true,
    minify: true,
    sourcemap: false
  },
  esbuild: {
    // Ignore TypeScript errors
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
})