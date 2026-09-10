import '@neondatabase/neon-js/ui/css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { neon } from './lib/neon';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <NeonAuthUIProvider emailOTP authClient={neon.auth}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </NeonAuthUIProvider>
  </StrictMode>
);