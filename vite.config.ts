
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Generate a unique build timestamp
const buildTimestamp = Date.now();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    // Add timestamp to filenames for cache busting
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name]-[hash]-${buildTimestamp}.js`,
        chunkFileNames: `assets/[name]-[hash]-${buildTimestamp}.js`,
        assetFileNames: `assets/[name]-[hash]-${buildTimestamp}.[ext]`
      }
    },
    // Generate manifest for debugging
    manifest: true,
  },
  // Force browser to not cache the index.html
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace('?v=123456', `?v=${buildTimestamp}`);
      }
    }
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
