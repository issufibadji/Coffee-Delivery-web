import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'react-toastify';
import { Session } from '@supabase/supabase-js';

import type { AuthUser } from '../types/auth';
import { supabase } from '../lib/supabase';
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
  isLoading: boolean;
  location: UserLocation | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  location: null,
  signInWithGoogle: async () => { },
  signOut: async () => { },
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState<UserLocation | null>(() =>
    getUserLocation(),
  );

  const resolveUserLocation = async (): Promise<UserLocation | null> => {
    if (!navigator.geolocation) {
      return null;
    }

    try {
      const coords = await new Promise<GeolocationCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => resolve(position.coords),
          (error) => reject(error),
          { timeout: 8000 },
        );
      });

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

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // Profile might not exist yet if trigger hasn't finished (though unlikely)
      // or if DB hasn't stabilized yet.
      console.warn('Profile fetch failed:', error.message);
      return null;
    }
    return data;
  };

  const handleSession = async (session: Session | null) => {
    if (session?.user) {
      const profile = await fetchProfile(session.user.id);

      const authUser: AuthUser = {
        id: session.user.id,
        name: profile?.name || session.user.user_metadata?.full_name || 'Usuário',
        email: session.user.email || '',
        avatarUrl: profile?.avatar_url || session.user.user_metadata?.avatar_url || '',
      };

      setUser(authUser);

      // Try to get location from Supabase addresses first
      try {
        const { data: addresses } = await supabase
          .from('addresses')
          .select('city, estate, country_code: road') // road is just a placeholder, we mostly want city/state
          .eq('user_id', session.user.id)
          .eq('is_default', true)
          .single();

        if (addresses) {
          const userLoc: UserLocation = {
            city: addresses.city,
            countryCode: addresses.estate // Using estate as state/region for the badge
          };
          setLocation(userLoc);
        } else if (!location) {
          const userLocation = await resolveUserLocation();
          if (userLocation) {
            setLocation(userLocation);
          }
        }
      } catch {
        if (!location) {
          const userLocation = await resolveUserLocation();
          if (userLocation) {
            setLocation(userLocation);
          }
        }
      }

      const redirect = getRedirect();
      if (redirect?.path) {
        clearRedirect();
        window.location.href = redirect.path;
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        handleSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });

    if (error) {
      toast.error('Não foi possível iniciar o login com o Google.');
      console.error(error);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    clearUserLocation();
    setLocation(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      location,
      signInWithGoogle,
      signOut,
    }),
    [user, isLoading, location],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

