import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allows access from other devices
    port: 5173,       // You can change this if needed
    strictPort: true, // Ensures the port doesn’t change
  },
})
