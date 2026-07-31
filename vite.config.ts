import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

const repoName = process.env.REPO_NAME;
const base =
  process.env.GITHUB_PAGES === "true" && repoName
    ? `/${repoName}/`
    : "/";

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
