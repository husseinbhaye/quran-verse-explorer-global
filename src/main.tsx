
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { toast } from 'sonner';

// Generate a unique session identifier for this page load
const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
console.log(`App initialized with session ID: ${sessionId}`);

// Store current session load time
sessionStorage.setItem('last_load', Date.now().toString());

// Function to force refresh the page
const forceRefresh = () => {
  console.log('Forcing page refresh due to new version');
  try {
    localStorage.setItem('refresh_reason', 'New version detected');
    localStorage.setItem('refresh_time', Date.now().toString());
    window.location.reload();
  } catch (err) {
    console.error('Error during refresh:', err);
    window.location.href = window.location.pathname + '?t=' + Date.now();
  }
};

// Check for version updates
if (import.meta.env.PROD) {
  const checkForUpdates = async () => {
    try {
      const cacheKey = `nocache=${Date.now()}`;
      const response = await fetch(`/version.json?${cacheKey}`, {
        headers: { 'Cache-Control': 'no-cache' },
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        const lastBuild = data.timestamp;
        const storedBuild = localStorage.getItem('app_build_timestamp');
        
        if (storedBuild && storedBuild !== lastBuild.toString()) {
          console.log(`Version change detected: ${storedBuild} → ${lastBuild}`);
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
          
          toast.info('New version detected! Updating application...');
          setTimeout(forceRefresh, 1500);
        } else if (!storedBuild) {
          console.log('Initial version stored:', lastBuild);
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
        }
      }
    } catch (e) {
      console.warn('Failed to check for updates:', e);
    }
  };
  
  checkForUpdates(); // Run immediately
  setInterval(checkForUpdates, 30 * 1000); // Check every 30 seconds
}

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);
