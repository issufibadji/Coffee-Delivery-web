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
  const { signInWithGoogle, isAuthenticated } = useContext(AuthContext);
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
        <LoginButton type="button" onClick={signInWithGoogle}>
          Entrar com Google
        </LoginButton>
      </LoginCard>
    </LoginContainer>
  );
};
