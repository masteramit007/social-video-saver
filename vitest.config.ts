import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Add your platforms here so they get pre-rendered into real HTML
const platforms = ['tiktok', 'sharechat', 'youtube', 'instagram', 'reddit']; 

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // This is the magic part for your 804 SEO pages
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths) {
      const platformRoutes = platforms.map(p => `/download/${p}`);
      return [...paths, ...platformRoutes];
    },
  },
  // Keeping your test settings just in case
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});