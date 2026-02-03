export type UserLocation = {
  city: string;
  countryCode: string;
};

const LOCATION_STORAGE_KEY = '@coffee-delivery:user-location';

export const saveUserLocation = (location: UserLocation) => {
  localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
};

export const getUserLocation = (): UserLocation | null => {
  const stored = localStorage.getItem(LOCATION_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as UserLocation;
  } catch {
    return null;
  }
};

export const clearUserLocation = () => {
  localStorage.removeItem(LOCATION_STORAGE_KEY);
};
