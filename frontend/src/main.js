import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueQueryPlugin } from '@tanstack/vue-query';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import App from "./App.vue";
import router from "./router";
import { bootstrapModules } from "@/core/bootstrap";
import { queryClient } from "@/services/queryClient";
import "@/assets/styles/tailwind.css";

const app = createApp(App);
const pinia = createPinia();

app.use(Antd);
app.use(pinia);
app.use(VueQueryPlugin, { queryClient });
app.use(router);

// Mount immediately so the user sees the app
app.mount("#app");
console.info('[Main] App mounted');

// Bootstrap in background (initializes auth etc)
bootstrapModules().then(() => {
  console.info('[Main] Modules bootstrapped');
});
