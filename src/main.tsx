
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Generate a unique session identifier for this page load
const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
console.log(`App initialized with session ID: ${sessionId}`);

// Store current session load time
sessionStorage.setItem('last_load', Date.now().toString());

// Function to force refresh the page
const forceRefresh = () => {
  console.log('Forcing page refresh due to new version');
  window.location.reload(true); // Force reload from server, not cache
};

// More aggressive check for version updates (every 30 seconds in production)
if (import.meta.env.PROD) {
  const checkForUpdates = async () => {
    try {
      // Add cache busting parameter to prevent cached responses
      const response = await fetch(`/version.json?nocache=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        const lastBuild = data.timestamp;
        
        // Check if we have stored the build timestamp
        const storedBuild = localStorage.getItem('app_build_timestamp');
        
        if (storedBuild && storedBuild !== lastBuild.toString()) {
          console.log(`Version change detected: ${storedBuild} → ${lastBuild}`);
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
          forceRefresh();
        } else if (!storedBuild) {
          // First time, just store it
          console.log('Initial version stored:', lastBuild);
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
        } else {
          console.log('Using current version:', lastBuild);
        }
      } else {
        console.warn('Failed to check for updates - server returned:', response.status);
      }
    } catch (e) {
      console.warn('Failed to check for updates:', e);
    }
  };
  
  // Check immediately and then every 30 seconds (more frequent checks)
  setTimeout(() => {
    checkForUpdates();
    setInterval(checkForUpdates, 30 * 1000);
  }, 2000); // Wait 2 seconds before first check to ensure page is loaded
}

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);
