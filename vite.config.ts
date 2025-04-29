
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
        transformIndexHtml(html: string): string {
          // Add timestamp to all scripts and stylesheets
          return html
            .replace('?v=123456', `?v=${buildTimestamp}`)
            .replace(/<script(.*?)src="(.*?)"/g, `<script$1src="$2?v=${buildTimestamp}"`)
            .replace(/<link(.*?)href="(.*?)"/g, `<link$1href="$2?v=${buildTimestamp}"`);
        }
      },
      {
        name: 'create-deployment-marker',
        closeBundle() {
          if (mode === 'production') {
            // Create a detailed deployment marker file
            const deploymentInfo = [
              "DEPLOYMENT MARKER - DO NOT DELETE",
              `Deployment timestamp: ${new Date().toISOString()}`,
              `Build timestamp: ${buildTimestamp}`,
              `Node.js version: ${process.version}`,
              `OS: ${process.platform} ${process.arch}`,
              `Build mode: ${mode}`
            ].join('\n');
            
            // Write to the dist directory
            if (!fs.existsSync('./dist')) {
              fs.mkdirSync('./dist');
            }
            fs.writeFileSync('./dist/deployment-marker.txt', deploymentInfo);
            console.log('Created deployment marker:', deploymentInfo);
          }
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
