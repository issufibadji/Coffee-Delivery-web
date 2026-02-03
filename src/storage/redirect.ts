export type RedirectInfo = {
  path: string;
  message?: string;
};

export type CheckoutFormData = {
  CEP: string;
  road: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  estate: string;
};

export type CheckoutSnapshot = {
  formData: CheckoutFormData;
  paymentPreference: string;
};

const REDIRECT_STORAGE_KEY = '@coffee-delivery:redirect';
const CHECKOUT_SNAPSHOT_KEY = '@coffee-delivery:checkout-snapshot';

export const saveRedirect = (redirect: RedirectInfo) => {
  localStorage.setItem(REDIRECT_STORAGE_KEY, JSON.stringify(redirect));
};

export const getRedirect = (): RedirectInfo | null => {
  const stored = localStorage.getItem(REDIRECT_STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as RedirectInfo;
  } catch {
    return null;
  }
};

export const clearRedirect = () => {
  localStorage.removeItem(REDIRECT_STORAGE_KEY);
};

export const saveCheckoutSnapshot = (snapshot: CheckoutSnapshot) => {
  localStorage.setItem(CHECKOUT_SNAPSHOT_KEY, JSON.stringify(snapshot));
};

export const getCheckoutSnapshot = (): CheckoutSnapshot | null => {
  const stored = localStorage.getItem(CHECKOUT_SNAPSHOT_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as CheckoutSnapshot;
  } catch {
    return null;
  }
};

export const clearCheckoutSnapshot = () => {
  localStorage.removeItem(CHECKOUT_SNAPSHOT_KEY);
};
