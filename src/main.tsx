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
    // Fallback refresh method
    window.location.href = window.location.pathname + '?t=' + Date.now();
  }
};

// Function to check if the version.json is actually new or if it's a cached version
const isVersionFileStale = (data: any, response: Response): boolean => {
  // Check for 'not-modified' response
  if (response.status === 304) {
    console.warn('Server returned 304 Not Modified - might be using cached version file');
    return true;
  }
  
  // Check for age of response via headers
  const lastModified = response.headers.get('last-modified');
  if (lastModified) {
    const modifiedDate = new Date(lastModified).getTime();
    const now = Date.now();
    const ageInHours = (now - modifiedDate) / (1000 * 60 * 60);
    
    if (ageInHours > 1) {
      console.warn(`Version file might be stale - last modified ${ageInHours.toFixed(1)} hours ago`);
      return true;
    }
  }
  
  return false;
}

// More aggressive check for version updates (every 10 seconds in production)
if (import.meta.env.PROD) {
  const checkForUpdates = async () => {
    try {
      // Add cache busting parameter to prevent cached responses
      const cacheKey = `nocache=${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
      const response = await fetch(`/version.json?${cacheKey}`, {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-store',
        credentials: 'same-origin'
      });
      
      if (response.ok) {
        const data = await response.json();
        const lastBuild = data.timestamp;
        
        // Check for stale version file
        if (isVersionFileStale(data, response)) {
          console.warn('Version check may be unreliable - using cached version file');
        }
        
        // Check if we have stored the build timestamp
        const storedBuild = localStorage.getItem('app_build_timestamp');
        
        if (storedBuild && storedBuild !== lastBuild.toString()) {
          console.log(`Version change detected: ${storedBuild} → ${lastBuild}`);
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
          
          // Show a toast notification before refreshing
          toast.info('New version detected! Updating application...');
          
          // Set a short timeout to allow the toast to be shown
          setTimeout(forceRefresh, 1500);
        } else if (!storedBuild) {
          // First time, just store it
          console.log('Initial version stored:', lastBuild);
          localStorage.setItem('app_build_timestamp', lastBuild.toString());
        } else {
          console.log('Using current version:', lastBuild);
        }
      } else {
        console.warn('Failed to check for updates - server returned:', response.status);
        
        // If we keep getting errors, show a warning
        const failCount = parseInt(sessionStorage.getItem('version_check_fails') || '0') + 1;
        sessionStorage.setItem('version_check_fails', failCount.toString());
        
        if (failCount > 5) {
          console.error('Multiple version check failures - might be server issue');
        }
      }
    } catch (e) {
      console.warn('Failed to check for updates:', e);
    }
  };
  
  // More frequent checks and immediate check on load
  checkForUpdates(); // Run immediately when the app loads
  setInterval(checkForUpdates, 10 * 1000); // Check every 10 seconds (more frequent)
}

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);
