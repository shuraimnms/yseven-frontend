import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { 
  preloadCriticalResources, 
  addResourceHints, 
  registerServiceWorker 
} from "./utils/performance";

// Initialize performance optimizations
preloadCriticalResources();
addResourceHints();

// Register service worker for caching
registerServiceWorker();

// Create root with concurrent features
const root = createRoot(document.getElementById("root")!, {
  // Enable concurrent features for better performance
  identifierPrefix: 'y7-'
});

root.render(<App />);
