/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    host: true, 
    strictPort: true,
    port: 2000,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup",
    css: true,
  },
});
