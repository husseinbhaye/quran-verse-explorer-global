
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple cache buster with unique timestamp
const cacheBuster = `?v=${new Date().getTime()}`;
console.log(`App initialized with cache buster: ${cacheBuster}`);

// Store current session load time
sessionStorage.setItem('last_load', new Date().getTime().toString());

// Check for version updates every 5 minutes in production
if (import.meta.env.PROD) {
  const checkForUpdates = async () => {
    try {
      const response = await fetch(`/version.json?t=${new Date().getTime()}`);
      if (response.ok) {
        const data = await response.json();
        const lastBuild = data.timestamp;
        
        // Check if we have stored the build timestamp
        const storedBuild = localStorage.getItem('app_build_timestamp');
        
        if (storedBuild && storedBuild !== lastBuild.toString()) {
          console.log('New version detected, refreshing...');
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
          window.location.reload();
        } else if (!storedBuild) {
          // First time, just store it
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
        }
      }
    } catch (e) {
      console.log('Failed to check for updates:', e);
    }
  };
  
  // Check immediately and then every 5 minutes
  checkForUpdates();
  setInterval(checkForUpdates, 5 * 60 * 1000);
}

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);
