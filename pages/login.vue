<template>
  <div
    class="h-screen w-screen flex align-items-center justify-content-center bg-bluegray-200"
  >
    <Pcard class="flex flex-column align-items-center justify-item-center">
      <template #header>
        <h3>Welcome to ProCon</h3>
      </template>
      <template #content>
        <Pcard class="surface-100">
          <template #content>
            <Pbutton
              type="button"
              label="Login with Github"
              icon="pi pi-github"
              @click="login"
            />
          </template>
        </Pcard>
      </template>
    </Pcard>
  </div>
</template>

<script setup lang="ts">
import { useDataStore } from "~/stores/datastore";
const user = useSupabaseUser();
const { auth } = useSupabaseAuthClient();

watchEffect(() => {
  if (user.value) {
    navigateTo("/");
  }
});

const login = async () => {
  const { data, error } = await auth.signInWithOAuth({ provider: "github" });
  console.log(data);
  if (error) createError(error);
};

// const login = auth.signInWithOAuth({ provider: "github" });
</script>

<style lang="scss" scoped></style>
