import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';

import type { AuthUser } from '../types/auth';
import { fetchGoogleUserInfo } from '../services/googleUserInfo';
import { clearAuthUser, getAuthUser, saveAuthUser } from '../storage/auth';

export type AuthContextData = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGoogleConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  isAuthenticated: false,
  isGoogleConfigured: false,
  signInWithGoogle: async () => {},
  signOut: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
  isGoogleConfigured?: boolean;
};

const AuthProviderWithGoogle = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  const signIn = useGoogleLogin({
    scope: 'profile email',
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await fetchGoogleUserInfo(tokenResponse.access_token);

        const authUser: AuthUser = {
          id: userInfo.sub,
          name: userInfo.name,
          email: userInfo.email,
          avatarUrl: userInfo.picture,
        };

        setUser(authUser);
        saveAuthUser(authUser);
      } catch (error) {
        toast.error('Não foi possível concluir o login com o Google.');
        console.error(error);
      }
    },
    onError: () => {
      toast.error('Não foi possível iniciar o login com o Google.');
    },
  });

  const signInWithGoogle = async () => {
    signIn();
  };

  const signOut = () => {
    setUser(null);
    clearAuthUser();
    // Mantém o usuário na página atual após logout.
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isGoogleConfigured: true,
      signInWithGoogle,
      signOut,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const AuthProviderFallback = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());

  const signInWithGoogle = async () => {
    toast.error(
      'O Client ID do Google não está configurado. Verifique o arquivo .env.',
    );
  };

  const signOut = () => {
    setUser(null);
    clearAuthUser();
    // Mantém o usuário na página atual após logout.
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isGoogleConfigured: false,
      signInWithGoogle,
      signOut,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const AuthProvider = ({
  children,
  isGoogleConfigured = true,
}: AuthProviderProps) => {
  if (isGoogleConfigured) {
    return <AuthProviderWithGoogle>{children}</AuthProviderWithGoogle>;
  }

  return <AuthProviderFallback>{children}</AuthProviderFallback>;
};
