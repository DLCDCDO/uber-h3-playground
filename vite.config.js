import { defineConfig } from "vite";

export default defineConfig({
  base: './',
  plugins: [],
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
