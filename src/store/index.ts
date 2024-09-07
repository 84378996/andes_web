import { createStore } from "vuex";
import moduleUser from "./user";
import moduleApp from "./app";
import moduleTagsView from "./tagsview";
const store = createStore({
  state: {},
  getters: {
    user(state: any) {
      return state.user.user;
    },
    token(state: any) {
      return state.user.token;
    },
    sidebar(state: any) {
      return state.app.sidebar;
    },
    visitedViews(state: any) {
      return state.tagsview.visitedViews;
    },
    cachedViews(state: any) {
      return state.tagsview.cachedViews;
    },
  },
  mutations: {},
  actions: {},
  modules: {
    user: moduleUser,
    app: moduleApp,
    tagsview: moduleTagsView,
  },
});
export default store;
