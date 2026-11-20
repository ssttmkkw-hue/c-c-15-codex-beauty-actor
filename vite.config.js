import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  server: { host: '127.0.0.1', port: 5715, strictPort: true },
  preview: { host: '127.0.0.1', port: 5815, strictPort: true },
})
