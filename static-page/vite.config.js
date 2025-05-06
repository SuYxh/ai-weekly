import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  publicDir: 'public',         // 默认，保持即可
  build: {
    // 将构建输出目录设置为 public
    outDir: 'dist',
    // 确保清空输出目录
    emptyOutDir: true,
    sourcemap: true,
  }
})
