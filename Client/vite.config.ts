import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "./",          // hoặc "." nếu file nằm trong Client
  build: {
    outDir: "dist",    // thư mục build output
  },
});