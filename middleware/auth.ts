// export default defineNuxtRouteMiddleware((to, from) => {
//   const user = useSupabaseUser();
//   const supabase = useSupabaseAuthClient().auth.getUser();
//   //   console.log("user", supabase, from, to);
//   // console.log("auth", from, user, user.value);

//   if (!supabase && !from.fullPath.startsWith("/#access_token=")) {
//     // console.log(user.value, from, to, "not login");
//     return navigateTo("/login");
//   }
// });

export default defineNuxtRouteMiddleware(() => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo("/login");
  }
});
