
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Simple cache buster with timestamp
const cacheBuster = `?v=${new Date().getTime()}`;
console.log(`App initialized with cache buster: ${cacheBuster}`);

// Store current session load time
sessionStorage.setItem('last_load', new Date().getTime().toString());

// Mount the React application
createRoot(document.getElementById("root")!).render(<App />);

