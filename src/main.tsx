
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
  window.location.reload();
};

// Check for version updates (simplified)
if (import.meta.env.PROD) {
  const checkForUpdates = async () => {
    try {
      const response = await fetch(`/version.json?nocache=${Date.now()}`, {
        cache: 'no-store'
      });
      
      if (response.ok) {
        const data = await response.json();
        const currentVersion = data.version;
        const storedVersion = localStorage.getItem('app_version');
        
        if (storedVersion && storedVersion !== currentVersion) {
          console.log(`Version change detected: ${storedVersion} → ${currentVersion}`);
          localStorage.setItem('app_version', currentVersion);
          
          toast.info('New version detected! Updating application...');
          setTimeout(forceRefresh, 1500);
        } else if (!storedVersion) {
          console.log('Initial version stored:', currentVersion);
          localStorage.setItem('app_version', currentVersion);
        }
      }
    } catch (e) {
      console.warn('Failed to check for updates:', e);
    }
  };
  
  // Check for updates less frequently (once per minute)
  checkForUpdates(); 
  setInterval(checkForUpdates, 60000);
}

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);
