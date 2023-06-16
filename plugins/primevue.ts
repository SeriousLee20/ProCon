import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component("Pbutton", Button);
  nuxtApp.vueApp.component("Pcard", Card);
  nuxtApp.vueApp.component("Pdropdown", Dropdown);
  //other components that you need
});
