import { ReactNode, useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

import { AuthContext } from '../contexts/AuthContext';
import { saveRedirect } from '../storage/redirect';

type ProtectedRouteProps = {
  children: ReactNode;
  message?: string;
};

export const ProtectedRoute = ({
  children,
  message = 'Faça login para acessar.',
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      saveRedirect({ path: location.pathname, message });
      toast.warning(message);
    }
  }, [isAuthenticated, location.pathname, message]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
