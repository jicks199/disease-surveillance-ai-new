import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Exposes the server to external connections
    port: process.env.PORT || 4173, // Uses Render's PORT or defaults to 4173
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // base: '/'// Change this if your site is hosted in a subdirectory
});
