import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // relative base so the build also works from a sub-path (e.g. GitHub Pages project site)
  base: './',
})
