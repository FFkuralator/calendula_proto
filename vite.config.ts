import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://host.docker.internal:8000',
        changeOrigin: true,
      },
    },
  },
})
