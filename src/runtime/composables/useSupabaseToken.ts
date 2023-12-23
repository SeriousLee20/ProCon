import { useCookie, useRuntimeConfig } from "#imports";

export const useSupabaseToken = () => {
  const {
    supabase: { cookieName: cookieName },
  } = useRuntimeConfig().public;
  const thisCookieName = `${cookieName}-access-token`;

  return useCookie(thisCookieName);
};
