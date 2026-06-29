import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at a subdomain root (ccc.divigner.com), so the default base "/" is used.
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
