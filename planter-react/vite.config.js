import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '/src': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true, // Enables `vi.fn()`
    environment: 'jsdom', // Simulates a browser environment for React
    setupFiles: './setupTests.js', // If you need global test setup
  },
});
