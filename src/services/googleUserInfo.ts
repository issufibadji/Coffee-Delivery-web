export type GoogleUserInfo = {
  sub: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  email: string;
  email_verified?: boolean;
  locale?: string;
};

export const fetchGoogleUserInfo = async (
  accessToken: string,
): Promise<GoogleUserInfo> => {
  const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Não foi possível obter os dados do Google.');
  }

  return (await response.json()) as GoogleUserInfo;
};
