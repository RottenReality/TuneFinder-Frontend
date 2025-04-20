import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
  plugins: [
    react(),
    istanbul({
      include: 'src/**/*',
      exclude: [
        '**/Callback.jsx'
      ],
      extension: ['.js', '.ts', '.jsx', '.tsx'],
      cypress: true,
    }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.js"
  },
});