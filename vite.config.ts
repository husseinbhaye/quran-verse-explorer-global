
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
      commitSha: process.env.GITHUB_SHA || 'local',
      buildId: process.env.GITHUB_RUN_ID || 'dev'
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
          // Add timestamp to all filenames for cache busting
          entryFileNames: `assets/[name]-${buildTimestamp}-[hash].js`,
          chunkFileNames: `assets/[name]-${buildTimestamp}-[hash].js`,
          assetFileNames: `assets/[name]-${buildTimestamp}-[hash].[ext]`
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
          // Add cache-busting meta tags and timestamp comment
          return html.replace(
            '</head>',
            `<!-- Build: ${buildTimestamp} -->
            <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
            <meta http-equiv="Pragma" content="no-cache" />
            <meta http-equiv="Expires" content="0" />
            </head>`
          );
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
