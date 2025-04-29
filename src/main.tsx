
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Cache busting with dynamic timestamp
const cacheBuster = `?v=${new Date().getTime()}`;
console.log(`App initialized with cache buster: ${cacheBuster}`);

// Force reload if app was previously loaded (helps with updates)
if (sessionStorage.getItem('last_load')) {
  const lastLoad = parseInt(sessionStorage.getItem('last_load') || '0');
  const now = new Date().getTime();
  // If app was loaded more than 1 hour ago, force reload
  if (now - lastLoad > 3600000) {
    console.log("Forcing refresh for new version...");
    sessionStorage.setItem('last_load', now.toString());
    window.location.reload(true);
  } else {
    sessionStorage.setItem('last_load', now.toString());
  }
} else {
  sessionStorage.setItem('last_load', new Date().getTime().toString());
}

// Check for updates and deployment marker
console.log("Checking for app updates...");
fetch(`/version.json${cacheBuster}`)
  .then(response => response.json())
  .then(data => {
    console.log("Version info:", data);
    // Store version info for future comparisons
    sessionStorage.setItem('app_version_data', JSON.stringify(data));
  })
  .catch(error => console.log('Version check failed:', error));

// Check for deployment marker
fetch(`/deployment-marker.txt${cacheBuster}`)
  .then(response => response.text())
  .then(data => {
    console.log("Deployment marker found:", data.slice(0, 50) + "...");
    const timestamp = data.match(/Deployment timestamp: (.*)/)?.[1];
    if (timestamp) {
      console.log("Deployment timestamp:", timestamp);
      
      // Force reload if new deployment detected
      const lastKnownDeployment = localStorage.getItem('last_deployment');
      if (lastKnownDeployment && lastKnownDeployment !== timestamp) {
        console.log("New deployment detected, forcing refresh...");
        localStorage.setItem('last_deployment', timestamp);
        window.location.reload(true);
      } else {
        localStorage.setItem('last_deployment', timestamp);
      }
    }
  })
  .catch(error => console.log('Deployment marker check failed:', error));

// Verify that the .htaccess cache control is working
fetch(`/test.html${cacheBuster}`)
  .then(response => response.text())
  .then(data => console.log("Test page accessible:", data.substring(0, 50) + "..."))
  .catch(error => console.log('Test page check failed:', error));

createRoot(document.getElementById("root")!).render(<App />);
