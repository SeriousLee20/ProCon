import { defineNuxtPlugin } from "#app";
import PrimeVue from "primevue/config";
import Button from "primevue/button";
import Card from "primevue/card";
import Dropdown from "primevue/dropdown";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import AvatarGroup from "primevue/avatargroup"; //Optional for grouping
import InputText from "primevue/inputtext";
import InputMask from "primevue/inputmask";
import Toast from "primevue/toast";
import ToastService from "primevue/toastservice";
import Textarea from "primevue/textarea";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component("Pbutton", Button);
  nuxtApp.vueApp.component("Pcard", Card);
  nuxtApp.vueApp.component("Pdropdown", Dropdown);
  nuxtApp.vueApp.component("Pmenu", Menu);
  nuxtApp.vueApp.component("Pavatar", Avatar);
  nuxtApp.vueApp.component("Pinputtext", InputText);
  nuxtApp.vueApp.component("Pinputmask", InputMask);
  nuxtApp.vueApp.component("Ptoast", Toast);
  nuxtApp.vueApp.component("Ptextarea", Textarea);

  //other components that you need

  nuxtApp.vueApp.use(ToastService);
});
