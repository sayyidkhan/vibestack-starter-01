import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Use esbuild CSS minification to avoid Lightning CSS warnings with Tailwind v4 at-rules.
export default defineConfig({
  plugins: [react()],
  build: {
    cssMinify: 'esbuild',
  },
})
