import { GoogleOAuthProvider } from '@react-oauth/google';
import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { AuthProvider } from './contexts/AuthContext';
import { OrdersProvider } from './providers/OrdersProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Routes } from './routes';
import {
  checkSupabaseConnection,
  isSupabaseConfigured,
  supabaseConfigError,
} from './services/supabase';

export default function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (supabaseConfigError) {
      console.error(supabaseConfigError);
      toast.error(supabaseConfigError);
      return;
    }

    if (!isSupabaseConfigured) {
      return;
    }

    checkSupabaseConnection().then((isConnected) => {
      if (!isConnected) {
        const message = 'Não foi possível conectar ao Supabase com a configuração atual.';
        console.error(message);
        toast.error(message);
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
