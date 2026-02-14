import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() ?? '';

const isSupabaseUrlValid = /^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(
  supabaseUrl,
);

const isPersonalAccessToken = supabaseAnonKey.startsWith('sbp_');
const isSupportedClientKey =
  supabaseAnonKey.startsWith('sb_publishable_') ||
  supabaseAnonKey.split('.').length === 3;

export const supabaseConfigError = (() => {
  if (!supabaseUrl) {
    return 'VITE_SUPABASE_URL não foi configurada no .env.';
  }

  if (!isSupabaseUrlValid) {
    return 'VITE_SUPABASE_URL é inválida. Use o domínio do projeto (ex.: https://SEU-PROJETO.supabase.co).';
  }

  if (!supabaseAnonKey) {
    return 'VITE_SUPABASE_ANON_KEY não foi configurada no .env.';
  }

  if (isPersonalAccessToken) {
    return 'A chave com prefixo sbp_ é um Personal Access Token da plataforma e não pode ser usada no front-end. Use a chave pública do projeto (anon/publishable).';
  }

  if (!isSupportedClientKey) {
    return 'VITE_SUPABASE_ANON_KEY parece inválida. Use a chave pública do projeto no painel do Supabase.';
  }

  return null;
})();

export const isSupabaseConfigured = !supabaseConfigError;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const checkSupabaseConnection = async () => {
  if (!supabase) {
    return false;
  }

  const { error } = await supabase.auth.getSession();

  return !error;
};
