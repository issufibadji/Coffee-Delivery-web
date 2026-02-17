import { useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { AuthProvider } from './contexts/AuthContext';
import { OrdersProvider } from './providers/OrdersProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { Routes } from './routes';
import { supabase } from './lib/supabase';

export default function App() {
  useEffect(() => {
    // Basic connection check to verify configuration
    supabase.auth.getSession().then(({ error }) => {
      if (error) {
        console.error('Supabase connection error:', error.message);
        toast.error('Não foi possível conectar ao Supabase.');
      }
    });
  }, []);

  return (
    <AuthProvider>
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
}
