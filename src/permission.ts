import router from "@/router";
import store from "@/store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getStoredToken } from "@/api/localstorage";
import { getPageTitle } from "@/api/common";
import { ElMessage } from "element-plus";
NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/kanban1"]; // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title as string);

  const hasToken = getStoredToken();
  if (hasToken) {
    if (to.path === "/kanban1") {
      next();
    } else if (to.path === "/login") {
      next({ path: "/" }); //直接跳转，不需要登录
    } else {
      const user = store.getters.user;
      if (user) {
        next();
      } else {
        try {
          // get user info
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          await store.dispatch("user/quit");
          ElMessage.error((error as string) || "Has Error");
          //this.$message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
        }
      }
    }
    NProgress.done();
  } else {
    console.log("has no token");
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
