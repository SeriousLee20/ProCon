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
import MultiSelect from "primevue/multiselect";
import Tooltip from "primevue/tooltip";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional
import Dialog from "primevue/dialog";
import Chips from "primevue/chips";
import ConfirmPopup from "primevue/confirmpopup";
import ConfirmationService from "primevue/confirmationservice";
import ToggleButton from "primevue/togglebutton";
import DataView from "primevue/dataview";
import DataViewLayoutOptions from "primevue/dataviewlayoutoptions"; // optional
import Tag from "primevue/tag";
import Editor from "primevue/editor";
import Quill from "quill";
import Calendar from "primevue/calendar";
import Rating from "primevue/rating";
import OverlayPanel from "primevue/overlaypanel";
import Chart from "primevue/chart";
import Listbox from "primevue/listbox";
import Accordion from "primevue/accordion";
import AccordionTab from "primevue/accordiontab";
import FileUpload from "primevue/fileupload";
import Checkbox from "primevue/checkbox";
import Inplace from "primevue/inplace";
import Carousel from "primevue/carousel";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
  nuxtApp.vueApp.component("Pbutton", Button);
  nuxtApp.vueApp.component("Pcard", Card);
  nuxtApp.vueApp.component("Pdropdown", Dropdown);
  nuxtApp.vueApp.component("Pmenu", Menu);
  nuxtApp.vueApp.component("Pavatar", Avatar);
  nuxtApp.vueApp.component("Pavatargroup", AvatarGroup);
  nuxtApp.vueApp.component("Pinputtext", InputText);
  nuxtApp.vueApp.component("Pinputmask", InputMask);
  nuxtApp.vueApp.component("Ptoast", Toast);
  nuxtApp.vueApp.component("Ptextarea", Textarea);
  nuxtApp.vueApp.component("Pmultiselect", MultiSelect);
  nuxtApp.vueApp.directive("tooltip", Tooltip);
  nuxtApp.vueApp.component("Pdatatable", DataTable);
  nuxtApp.vueApp.component("Pcolumn", Column);
  nuxtApp.vueApp.component("Pcolumngroup", ColumnGroup);
  nuxtApp.vueApp.component("Prow", Row);
  nuxtApp.vueApp.component("Pdialog", Dialog);
  nuxtApp.vueApp.component("Pchips", Chips);
  nuxtApp.vueApp.component("Pconfirmpopup", ConfirmPopup);
  nuxtApp.vueApp.component("Ptogglebutton", ToggleButton);
  nuxtApp.vueApp.component("Pdataview", DataView);
  nuxtApp.vueApp.component("Ptag", Tag);
  nuxtApp.vueApp.component("Peditor", Editor);
  nuxtApp.vueApp.component("Pcalendar", Calendar);
  nuxtApp.vueApp.component("Prating", Rating);
  nuxtApp.vueApp.component("Poverlay-panel", OverlayPanel);
  nuxtApp.vueApp.component("PChart", Chart);
  nuxtApp.vueApp.component("PListbox", Listbox);
  nuxtApp.vueApp.component("Paccordian", Accordion);
  nuxtApp.vueApp.component("Paccordiantab", AccordionTab);
  nuxtApp.vueApp.component("Pfileupload", FileUpload);
  nuxtApp.vueApp.component("Pcheckbox", Checkbox);
  nuxtApp.vueApp.component("Pinplace", Inplace);
  nuxtApp.vueApp.component("Pcarousel", Carousel);

  // Quill.register(Editor, true);

  //other components that you need

  nuxtApp.vueApp.use(ToastService);
  nuxtApp.vueApp.use(ConfirmationService);
});
