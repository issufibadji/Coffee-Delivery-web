import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

import { Routes } from './routes';

import { ThemeProvider } from './providers/ThemeProvider';
import { OrdersProvider } from './providers/OrdersProvider';
import { AuthProvider } from './contexts/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
    </GoogleOAuthProvider>
  );
}
