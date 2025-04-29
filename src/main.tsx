
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add cache busting for development and production
const cacheBuster = `?v=${new Date().getTime()}`;
console.log(`App initialized with cache buster: ${cacheBuster}`);

// Check for updates and deployment marker
console.log("Checking for app updates...");
fetch(`/version.json${cacheBuster}`)
  .then(response => response.json())
  .then(data => console.log("Version info:", data))
  .catch(error => console.log('Version check failed:', error));

// Check for deployment marker
fetch(`/deployment-marker.txt${cacheBuster}`)
  .then(response => response.text())
  .then(data => console.log("Deployment marker found:", data.slice(0, 50) + "..."))
  .catch(error => console.log('Deployment marker check failed:', error));

createRoot(document.getElementById("root")!).render(<App />);
