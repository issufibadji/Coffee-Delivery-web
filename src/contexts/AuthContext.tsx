import { createContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';

import type { AuthUser } from '../types/auth';
import { fetchGoogleUserInfo } from '../services/googleUserInfo';
import { clearAuthUser, getAuthUser, saveAuthUser } from '../storage/auth';
import { clearRedirect, getRedirect } from '../storage/redirect';
import {
  clearUserLocation,
  getUserLocation,
  saveUserLocation,
  UserLocation,
} from '../storage/location';

export type AuthContextData = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isGoogleConfigured: boolean;
  isLoading: boolean;
  location: UserLocation | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  isAuthenticated: false,
  isGoogleConfigured: false,
  isLoading: false,
  location: null,
  signInWithGoogle: async () => {},
  signOut: () => {},
});

type AuthProviderProps = {
  children: ReactNode;
  isGoogleConfigured?: boolean;
};

const AuthProviderWithGoogle = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<UserLocation | null>(() =>
    getUserLocation(),
  );

  const resolveUserLocation = async (): Promise<UserLocation | null> => {
    if (!navigator.geolocation) {
      return null;
    }

    const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error),
        { timeout: 8000 },
      );
    }).catch(() => null);

    if (!coords) {
      return null;
    }

    try {
      const response = await fetch(
        `https://geocode.maps.co/reverse?lat=${coords.latitude}&lon=${coords.longitude}`,
      );

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as {
        address?: { city?: string; town?: string; state?: string; country_code?: string };
      };
      const city =
        data.address?.city ?? data.address?.town ?? data.address?.state ?? '';
      const countryCode = data.address?.country_code ?? 'BR';

      if (!city) {
        return null;
      }

      return { city, countryCode: countryCode.toUpperCase() };
    } catch {
      return null;
    }
  };

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

        const userLocation = await resolveUserLocation();
        if (userLocation) {
          saveUserLocation(userLocation);
          setLocation(userLocation);
        }

        const redirect = getRedirect();
        if (redirect?.path) {
          clearRedirect();
          window.location.href = redirect.path;
        }
      } catch (error) {
        toast.error('Não foi possível concluir o login com o Google.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      toast.error('Não foi possível iniciar o login com o Google.');
      setIsLoading(false);
    },
  });

  const signInWithGoogle = async () => {
    setIsLoading(true);
    signIn();
  };

  const signOut = () => {
    setUser(null);
    clearAuthUser();
    clearUserLocation();
    setLocation(null);
    // Mantém o usuário na página atual após logout.
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isGoogleConfigured: true,
      isLoading,
      location,
      signInWithGoogle,
      signOut,
    }),
    [user, isLoading, location],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const AuthProviderFallback = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(() => getAuthUser());
  const [isLoading, setIsLoading] = useState(false);
  const [location] = useState<UserLocation | null>(() => getUserLocation());

  const signInWithGoogle = async () => {
    setIsLoading(true);
    toast.error(
      'O Client ID do Google não está configurado. Verifique o arquivo .env.',
    );
    setIsLoading(false);
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
      isLoading,
      location,
      signInWithGoogle,
      signOut,
    }),
    [user, isLoading, location],
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
