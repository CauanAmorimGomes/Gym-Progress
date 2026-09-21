import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O front roda em http://localhost:5173 e repassa as chamadas /api
// para o back-end em C# (http://localhost:5000).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }
})
