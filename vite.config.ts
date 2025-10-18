import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true, // Écouter sur toutes les interfaces (nécessaire pour Docker)
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true, // Nécessaire pour hot reload dans Docker (Windows/Mac)
    },
    hmr: {
      overlay: true, // Afficher les erreurs en overlay
    },
  },
})