import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/Rynex/' : '/',
  server: {
    allowedHosts: true,
    proxy: {
      '/api': {
        target: process.env.RYNEX_API_URL || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
});
