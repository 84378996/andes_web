import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
//使用 Element Plus。
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

//导入 Element Plus所有图标
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

import zhCn from "element-plus/dist/locale/zh-cn.mjs";
//import zhCn from "element-plus/es/locale/lang/zh-cn";
//自定义图标
import "@/components/svgicon/index.ts";
import SvgIcon from "@/components/svgicon/index.vue";

import "@/styles/index.scss";
import "@/permission";

import uploader from "vue-simple-uploader";
import "vue-simple-uploader/dist/style.css";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
  size: "large",
});
app.use(uploader);
//导入 Element Plus所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.component("svg-icon", SvgIcon);

app.mount("#app");
