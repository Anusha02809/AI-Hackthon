import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/parse-address': 'http://localhost:8000',
      '/pincode': 'http://localhost:8000',
      '/reverse': 'http://localhost:8000',
    },
  },
})