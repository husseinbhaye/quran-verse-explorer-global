
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';

// Generate a unique build timestamp
const buildTimestamp = Date.now();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Create version.json file for client-side cache detection
  if (mode === 'production') {
    const versionInfo = {
      buildTime: new Date().toISOString(),
      timestamp: buildTimestamp,
      version: process.env.npm_package_version || '1.0.0',
    };
    
    // Ensure the public directory exists
    if (!fs.existsSync('./public')) {
      fs.mkdirSync('./public');
    }
    
    // Write version info to a file that will be included in the build
    fs.writeFileSync('./public/version.json', JSON.stringify(versionInfo, null, 2));
    
    console.log('Created version.json with build timestamp:', buildTimestamp);
  }

  return {
    server: {
      host: "::",
      port: 8080,
    },
    build: {
      rollupOptions: {
        output: {
          entryFileNames: `assets/[name]-[hash].js`,
          chunkFileNames: `assets/[name]-[hash].js`,
          assetFileNames: `assets/[name]-[hash].[ext]`
        }
      },
      manifest: true,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      {
        name: 'html-transform',
        transformIndexHtml(html: string): string {
          return html;
        }
      }
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
