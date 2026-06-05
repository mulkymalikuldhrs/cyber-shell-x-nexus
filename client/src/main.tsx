import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found. Ensure there is a <div id="root"></div> in index.html.');
}

createRoot(rootElement).render(<App />);
