import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from "./context/UserContext.jsx";
import { RetrievalInstructionsProvider } from "./context/RetrievalInstructionsContext.jsx";
import App from './App.jsx';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RetrievalInstructionsProvider>
        <App/>
      </RetrievalInstructionsProvider>
    </UserProvider>
  </StrictMode>
)
