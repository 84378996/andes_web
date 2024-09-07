import Cookies from "js-cookie";
import { VuexContext } from "@/api/interface";
interface IAppState {
  sidebar: boolean;
}

const moduleApp = {
  namespaced: true,
  state: (): IAppState => ({
    sidebar: Cookies.get("sidebarStatus") === "false" ? false : true,
  }),
  mutations: {
    TOGGLE_SIDEBAR: (state: IAppState) => {
      state.sidebar = !state.sidebar;
      Cookies.set("sidebarStatus", state.sidebar === true ? "true" : "false");
    },
    CLOSE_SIDEBAR: (state: IAppState) => {
      Cookies.set("sidebarStatus", "false");
      state.sidebar = false;
    },
  },
  actions: {
    toggleSideBar({ commit }: VuexContext) {
      commit("TOGGLE_SIDEBAR");
    },
    closeSideBar({ commit }: VuexContext) {
      commit("CLOSE_SIDEBAR");
    },
  },
};

export default moduleApp;
