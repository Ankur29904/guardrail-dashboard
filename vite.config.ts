import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(() => {
  const isNetlify = process.env.NETLIFY === 'true'
  const isVercel = Boolean(process.env.VERCEL)

  const base = isNetlify || isVercel ? '/' : '/guardrail-dashboard/'

  return {
    base,
    plugins: [
      tailwindcss(),
      react(),
    ],
  }
})
