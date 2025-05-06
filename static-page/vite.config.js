import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // 将构建输出目录设置为 public
    outDir: 'public',
    // 确保清空输出目录
    emptyOutDir: true,
    sourcemap: true,
    // 如果需要部署到子目录，可以设置 base
    // base: '/your-subdirectory/'
  }
})
