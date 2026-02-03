import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '../../contexts/AuthContext';

import {
  LoginButton,
  LoginCard,
  LoginContainer,
  LoginDescription,
  LoginTitle,
} from './styles';

export const Login = () => {
  const { signInWithGoogle, isAuthenticated, isGoogleConfigured } =
    useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Entrar</LoginTitle>
        <LoginDescription>
          Use sua conta Google para continuar e manter seus pedidos salvos.
        </LoginDescription>
        {!isGoogleConfigured && (
          <LoginDescription>
            Configure o Client ID do Google no arquivo <strong>.env</strong> para
            habilitar o login.
          </LoginDescription>
        )}
        <LoginButton
          type="button"
          onClick={signInWithGoogle}
          disabled={!isGoogleConfigured}
        >
          Entrar com Google
        </LoginButton>
      </LoginCard>
    </LoginContainer>
  );
};
