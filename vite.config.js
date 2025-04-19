import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import istanbul from 'vite-plugin-istanbul';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    istanbul({ include: 'src/*' }),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/tests/setup.js"
  },
});