import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,          // важно для Docker
    port: 5173,
    strictPort: true,

    proxy: {
      "/api": {
        target: "http://backend:8000",
        changeOrigin: true,
        secure: false,
      },
      "/media": {
        target: "http://backend:8000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
