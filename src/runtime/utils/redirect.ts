import { useRuntimeConfig, useRouter } from "#imports";

export const redirectToLogin = (toPath: string) => {
  const router = useRouter();

  const redirectOptions = useRuntimeConfig().public.supabase.redirectOptions;
  if (redirectOptions && redirectOptions.login) {
    // Do not redirect for login and callback pages
    if ([redirectOptions.login, redirectOptions.callback].includes(toPath)) {
      return;
    }

    // Do not redirect if route not resolved by router (must return 404)
    if (!router.resolve(toPath).name) {
      return;
    }

    router.push(redirectOptions.login);
  }
};
