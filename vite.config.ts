import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allow external access
    strictPort: true // Ensures the port is fixed
  },
  preview: {
    allowedHosts: ["disease-surveillance-ai.onrender.com"]
  }
});
