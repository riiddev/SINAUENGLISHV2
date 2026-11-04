import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        belajar: resolve(import.meta.dirname, "belajar.html"),
        designSystem: resolve(import.meta.dirname, "design-system.html")
      }
    }
  },
  server: {
    host: "0.0.0.0",
    port: 5173
  }
});
