import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(),
    viteTsconfigPaths(),],
  server: {
    open: false, 
    port: 3000,
    host: true
  },
  build: {
    outDir: 'build',
    target: 'esnext',
  },
});

