// import { sessionStorage } from "@/store/sesson.js";
import { RouteLocationNormalizedLoaded } from "vue-router";
import { VuexContext } from "@/api/interface";
interface TagsViewState {
  visitedViews: RouteLocationNormalizedLoaded[];
  //visitedViews: RouteLocationNormalized[];
  cachedViews: string[];
}

const moduleTagsView = {
  namespaced: true,
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: [],
  }),
  mutations: {
    ADD_VISITED: (
      state: TagsViewState,
      view: RouteLocationNormalizedLoaded
    ) => {
      if (view.path == "/login") return;
      //if (state.visitedViews.some((v) => v.path === view.path)) return;
      for (let i = 0; i < state.visitedViews.length; i++) {
        const route = state.visitedViews[i];
        if (route.name === view.name) {
          if (route.params && view.params) {
            if (route.params.value === view.params.value) return;
          } else {
            return;
          }
        }
      }

      state.visitedViews.push(view);
    },
    DEL_VISITED: (
      state: TagsViewState,
      view: RouteLocationNormalizedLoaded
    ) => {
      for (const [i, v] of state.visitedViews.entries()) {
        if (v.path === view.path) {
          state.visitedViews.splice(i, 1);
          break;
        }
      }
    },
    DEL_OTHERS_VISITED: (
      state: TagsViewState,
      view: RouteLocationNormalizedLoaded
    ) => {
      state.visitedViews = state.visitedViews.filter((v) => {
        return v.meta?.affix || v.path === view.path;
      });
    },
    DEL_ALL_VISITED: (state: TagsViewState) => {
      // keep affix tags
      console.log("DEL_ALL_VISITED");
      const affixTags = state.visitedViews.filter((tag) => tag.meta?.affix);
      state.visitedViews = affixTags;
    },
    UPDATE_VISITED: (
      state: TagsViewState,
      view: RouteLocationNormalizedLoaded
    ) => {
      for (let v of state.visitedViews) {
        if (v.path === view.path) {
          v = Object.assign(v, view);
          break;
        }
      }
    },
    ADD_CACHED: (state: TagsViewState, view: RouteLocationNormalizedLoaded) => {
      if (typeof view.name !== "string") return;
      if (state.cachedViews.includes(view.name ?? "")) return;
      if (view.meta?.cache) {
        state.cachedViews.push(view.name ?? "");
      }
    },

    DEL_CACHED: (state: TagsViewState, view: RouteLocationNormalizedLoaded) => {
      if (typeof view.name !== "string") return;
      const index = state.cachedViews.indexOf(view.name);
      if (index > -1) {
        state.cachedViews.splice(index, 1);
      }
    },

    DEL_OTHERS_CACHED: (
      state: TagsViewState,
      view: RouteLocationNormalizedLoaded
    ) => {
      if (typeof view.name !== "string") return;
      const index = state.cachedViews.indexOf(view.name);
      if (index > -1) {
        state.cachedViews = state.cachedViews.slice(index, index + 1);
      } else {
        // if index = -1, there is no cached tags
        state.cachedViews = [];
      }
    },

    DEL_ALL_CACHED: (state: TagsViewState) => {
      state.cachedViews = [];
    },
  },
  actions: {
    addView({ commit }: VuexContext, view: RouteLocationNormalizedLoaded) {
      return new Promise<void>((resolve) => {
        commit("ADD_VISITED", view);
        commit("ADD_CACHED", view);
        resolve();
      });
    },
    addVisitedView(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      return new Promise<void>((resolve) => {
        commit("ADD_VISITED", view);
        resolve();
      });
    },
    addCachedView(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      return new Promise<void>((resolve) => {
        commit("ADD_CACHED", view);
        resolve();
      });
    },

    delView({ commit }: VuexContext, view: RouteLocationNormalizedLoaded) {
      return new Promise<void>((resolve) => {
        commit("DEL_VISITED", view);
        commit("DEL_CACHED", view);
        // resolve({
        //   visitedviews: [...state.visitedviews],
        //   cachedviews: [...state.cachedviews],
        // });
        resolve();
      });
    },
    delVisitedView(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      return new Promise<void>((resolve) => {
        commit("DEL_VISITED", view);
        //resolve([...state.visitedviews]);
        resolve();
      });
    },
    delCachedView(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      return new Promise<void>((resolve) => {
        commit("DEL_CACHED", view);
        //resolve([...state.cachedviews]);
        resolve();
      });
    },

    delOthersViews(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      return new Promise<void>((resolve) => {
        commit("DEL_OTHERS_VISITED", view);
        commit("DEL_OTHERS_CACHED", view);

        // resolve({
        //   visitedviews: [...state.visitedviews],
        //   cachedviews: [...state.cachedviews],
        // });
        resolve();
      });
    },
    delOthersVisitedViews(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      return new Promise<void>((resolve) => {
        commit("DEL_OTHERS_VISITED", view);
        //resolve([...state.visitedviews]);
        resolve();
      });
    },
    delOthersCachedViews(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      return new Promise<void>((resolve) => {
        commit("DEL_OTHERS_CACHED", view);
        //resolve([...state.cachedviews]);
        resolve();
      });
    },

    delAllViews({ commit }: VuexContext) {
      return new Promise<void>((resolve) => {
        commit("DEL_ALL_VISITED");
        commit("DEL_ALL_CACHED");
        // resolve({
        //   visitedviews: [...state.visitedviews],
        //   cachedviews: [...state.cachedviews],
        // });
        resolve();
      });
    },
    delAllVisitedViews({ commit }: VuexContext) {
      return new Promise<void>((resolve) => {
        commit("DEL_ALL_VISITED");
        //resolve([...state.visitedviews]);
        resolve();
      });
    },
    delAllCachedViews({ commit }: VuexContext) {
      return new Promise<void>((resolve) => {
        commit("DEL_ALL_CACHED");
        //resolve([...state.cachedviews]);
        resolve();
      });
    },

    updateVisitedView(
      { commit }: VuexContext,
      view: RouteLocationNormalizedLoaded
    ) {
      commit("UPDATE_VISITED", view);
    },
  },
};

export default moduleTagsView;
