import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { app: 'index.html', game: 'game.html' },
      output: { manualChunks: { phaser: ['phaser'] } }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
