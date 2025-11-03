import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from "./context/UserContext.jsx";
import { ScrapeConfigProvider } from "./context/RetrievalInstructionsContext.jsx";
import App from './App.jsx';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ScrapeConfigProvider>
        <App/>
      </ScrapeConfigProvider>
    </UserProvider>
  </StrictMode>
)
