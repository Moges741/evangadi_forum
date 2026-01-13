import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Add base URL if deploying to subpath
  base: '/',
  // Optimize for production
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },
  server: {
    // Only for development
    port: 3000,
  }
})