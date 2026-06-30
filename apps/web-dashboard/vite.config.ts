import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// GitHub Pages project site: https://<user>.github.io/<repo>/
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: { port: 5173 },
  resolve: {
    alias: {
      '@heritage/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
});
