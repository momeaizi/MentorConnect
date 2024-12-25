import { BrowserRouter } from 'react-router-dom';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@/assets/styles/globals.css';
import { AuthProvider } from './providers/AuthProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode >,
)
