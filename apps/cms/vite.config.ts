import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/cms/",

  plugins: [react(), tailwindcss()],

  server: {
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@shared/sections": path.resolve(
        __dirname,
        "../../packages/sharedSections",
      ),
      react: path.resolve(__dirname, "../../node_modules/react"),
      "react-dom": path.resolve(
        __dirname,
        "../../node_modules/react-dom"
      ),
    },
  },

  optimizeDeps: {
    include: ["react", "react-dom"],
  },
});