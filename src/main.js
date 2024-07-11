import Vue from "vue";
import VueRouter from "vue-router";
import VueNotify from "vue-notifyjs";
import VeeValidate from "vee-validate";
import VTree from "vue-tree-halower";
import VueValidationVi from "vee-validate/dist/locale/vi";
import locale from "element-ui/lib/locale";
import App from "./App.vue";
import * as VueGoogleMaps from "vue2-google-maps";
import VueQrcode from "@chenfengyuan/vue-qrcode";
import { Loading } from "element-ui";

// store/vuex setup
import store from "./store/store";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import SideBar from "./components/UIComponents/SidebarPlugin";

// library imports
// css
import "sweetalert2/dist/sweetalert2.css";
import "vue-notifyjs/themes/default.css";
import "./assets/sass/paper-dashboard.scss";
import "./assets/sass/element_variables.scss";
import "./assets/sass/global.scss";
import "./assets/css/ec-icons.css";

Vue.use(VueRouter);
Vue.use(GlobalDirectives);
Vue.use(GlobalComponents);
Vue.use(VueNotify);
Vue.use(VTree);
Vue.use(SideBar, { sidebarLinks: [] });
Vue.use(VeeValidate, {
  locale: "vi",
  dictionary: {
    vi: VueValidationVi
  },
  fieldsBagName: "ElForm"
});
Vue.component(VueQrcode.name, VueQrcode);
Vue.use(Loading.directive);

// cusombize
import lodash from "lodash";
import util from "src/helpers/util";

Object.defineProperty(Vue.prototype, "$_", {
  get() {
    return lodash;
  }
});

Object.defineProperty(Vue.prototype, "$t", {
  get() {
    const transFunc = function(path, option) {
      let trans = arguments[0] && arguments[0].split(".").pop();
      try {
        trans = locale.t(path, option) || trans;
      } catch (error) {
        trans = trans || "";
      }
      return trans;
    };
    return transFunc;
  }
});

Object.defineProperty(Vue.prototype, "$util", {
  get() {
    return util;
  }
});

// configure router
import router from "./router";

window.__FUNC = window.__FUNC ? window.__FUNC : {};
window.__FUNC.CustomField = window.__FUNC.CustomField
  ? window.__FUNC.CustomField
  : function() {};
window.__FUNC.ImageSize = window.__FUNC.ImageSize
  ? window.__FUNC.ImageSize
  : function() {};
window.__FUNC.Dashboard = window.__FUNC.Dashboard
  ? window.__FUNC.Dashboard
  : [];

// google map
// Vue.use(VueGoogleMaps, {
//   load: {
//     key: 'AIzaSyAkK1Nj9HWtb4R0crJISga3j9hq2aBC8lQ',
//     libraries: 'places'
//   }
// });

/* eslint-disable no-new */
window.vueApp = new Vue({
  el: "#app",
  render: h => h(App),
  router,
  store
});

function vueAppInjectCode() {
  for (let f of window.__FUNC.Injections) {
    f(Vue, window.vueApp, store, router);
  }
}

if (window.__FUNC.Injections) {
  vueAppInjectCode();
} else {
  window.__vueAppInjectCode = vueAppInjectCode;
}

window.__vueAppLoaded = true;
