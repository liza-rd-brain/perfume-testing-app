// vite.config.ts
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [reactRouter()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
  }
});