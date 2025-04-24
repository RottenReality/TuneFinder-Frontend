import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import istanbul from "vite-plugin-istanbul";

export default defineConfig({
  define: {
    'import.meta.env.VITE_APP_BASE_URL': JSON.stringify(process.env.APP_BASE_URL),
  },
  plugins: [
    react(),
    istanbul({
      include: "src/**/*",
      exclude: ["**/Callback.jsx"],
      extension: [".js", ".ts", ".jsx", ".tsx"],
      cypress: true,
      requireEnv: false
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setup.js',
    include: ['src/**/*.{test,spec}.{js,jsx}'],
    coverage: {
      reporter: ['text', 'lcov'],
      include: [
        'src/App.jsx',
        'src/components/**/*.{js,jsx}',
      ],
      exclude: [
        'src/main.jsx',
        'src/store.js',
        'src/reducers/**',
      ],
    },
  },
});
