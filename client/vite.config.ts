import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
    server: {
    host: '0.0.0.0',  // Bind to all network interfaces
    port: 1256       // Or any port that Render will bind to
  },
});
