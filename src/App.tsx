import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Routes } from './routes';

import { ThemeProvider } from './providers/ThemeProvider';
import { OrdersProvider } from './providers/OrdersProvider';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { checkSupabaseConnection, isSupabaseConfigured } from './services/supabase';

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;


  useEffect(() => {
    if (!isSupabaseConfigured) {
      return;
    }

    checkSupabaseConnection().then((isConnected) => {
      if (!isConnected) {
        console.error('Não foi possível conectar ao Supabase.');
      }
    });
  }, []);

  const appContent = (
    <AuthProvider isGoogleConfigured={!!googleClientId}>
      <OrdersProvider>
        <ThemeProvider>
          <Routes />
          <ToastContainer
            autoClose={3000}
            pauseOnHover={false}
            style={{ width: 'max-content' }}
          />
        </ThemeProvider>
      </OrdersProvider>
    </AuthProvider>
  );

  return (
    <>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {appContent}
        </GoogleOAuthProvider>
      ) : (
        appContent
      )}
    </>
  );
}
