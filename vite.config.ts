import { defineConfig } from "vite";

// Relative base so the built site works from any path — GitHub Pages
// project sites, Netlify, a plain file server, etc.
export default defineConfig({
  base: "./",
  build: {
    target: "es2020",
    outDir: "dist",
  },
});
