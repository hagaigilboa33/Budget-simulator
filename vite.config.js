import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// BASE_URL is injected by the GitHub Actions workflow (= /repo-name/)
// Falls back to '/' for local dev and Netlify
export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [react()],
})
