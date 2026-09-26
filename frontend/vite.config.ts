import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backend = env.LOCAL_BACKEND_URL || "http://backend:8000";
  return {
  plugins: [react()],

  server: {
    host: true,          // важно для Docker
    port: 5173,
    strictPort: true,

    proxy: {
      "/api": {
        target: backend,
        changeOrigin: true,
        secure: false,
      },
      "/media": {
        target: backend,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  };
});
