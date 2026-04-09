import { defineConfig } from 'vite'

export default defineConfig({
  base: './',      // 👈 就这一行救你整个页面
  build: {
    outDir: 'dist'
  }
})