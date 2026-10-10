import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Kept deliberately light: this sandbox is memory-constrained, so we turn off
// the heavier minification passes (they fall back to WebAssembly here).
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    minify: false,
    cssMinify: false,
    target: 'esnext',
    sourcemap: false,
  },
})
