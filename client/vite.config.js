import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import checker from 'vite-plugin-checker';

// ----------------------------------------------------------------------

export default defineConfig({
  plugins: [
    react(),
    checker({
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
      },
    }),
  ],
  resolve: {
    alias: {
      '~': path.join(process.cwd(), 'node_modules'),
      src: path.join(process.cwd(), 'src'),
      '@contracts': path.resolve(__dirname, '../smart-contract/build/contracts'),
    },
  },
  server: {
    port: 3030,
  },
  preview: {
    port: 3030,
  },
});
