import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes/routes";
import initProgress from "./progressbar";
import store from "./store/store";
import util from "./helpers/util";

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  linkActiveClass: "active"
});

router.beforeEach((to, from, next) => {
  const role = store.getters.role;
  if (to.path === "/forgot" || to.path === "/not-found") {
    return next();
  }
  if (to.path === "/login") {
    if (!store.getters.isAuthenticated) {
      return next();
    }
    return next("/");
  }
  // if (!store.getters.isAuthenticated) {
  //   return next('/login');
  // }
  if (to.path === "/") {
    if (role === "supporter") {
      return next("/review");
    }
    const allowRoute = store.state.routePermission.filter(item => {
      if (item.roles.includes(role)) return item;
    });
    if (allowRoute.length) {
      return next(allowRoute[0].path);
    }

    return next("/notification");
  }
  // if (!util.isAllowRoute(to.path, role)) {
  //   return next("/not-found");
  // }
  return next();
});

initProgress(router);

export default router;
