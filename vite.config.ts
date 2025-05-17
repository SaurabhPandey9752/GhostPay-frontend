import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    host: true,
  },
  // Ensure client-side routing works correctly when refreshing the page
  preview: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: "dist",
    sourcemap: process.env.NODE_ENV !== "production",
  },
});
