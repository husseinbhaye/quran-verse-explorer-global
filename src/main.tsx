
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add cache busting for development and production
const cacheBuster = `?v=${new Date().getTime()}`;
console.log(`App initialized with cache buster: ${cacheBuster}`);

// Check for updates
fetch(`/version.json${cacheBuster}`)
  .then(response => response.json())
  .catch(error => console.log('Version check failed:', error));

createRoot(document.getElementById("root")!).render(<App />);
