import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ai-side-hustle/',  // ← 改成你的 GitHub repo 名
})
