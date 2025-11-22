import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from "./context/UserContext.jsx";
import { ConfigProvider } from "./context/ConfigContext.jsx";
import { RetrievalInstructionProvider } from "./context/RetrievalInstructionContext.jsx";
import App from './App.jsx';
import '../index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <ConfigProvider>
        <RetrievalInstructionProvider>
          <App/>
        </RetrievalInstructionProvider>
      </ConfigProvider>
    </UserProvider>
  </StrictMode>
)
