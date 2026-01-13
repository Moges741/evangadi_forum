import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',  // Use esbuild instead of terser
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined  // Simplify for now
      }
    }
  }
})