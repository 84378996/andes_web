import {
  getStoredToken,
  setStoredToken,
  getStoredUserKey,
  setStoredUserKey,
  removeStoredToken,
  removeStoredUserKey,
} from "@/api/localstorage";

import { UserInfo, ResponseObject } from "@/api/interface";
import { apiLogin, apiLogout, apiGetUser } from "@/api/user";
import { getToken } from "@/api/token";
import { VuexContext } from "@/api/interface";

interface UserState {
  user: UserInfo | null; // Replace 'any' with the actual type of 'user'
  token: string | null;
  userkey: string | null;
}

const moduleUser = {
  namespaced: true,
  state: (): UserState => ({
    //注意：不是每次调用的时候，执行getToken，只有在初始化的时候执行
    user: null,
    token: getStoredToken(),
    userkey: getStoredUserKey(),
  }),
  mutations: {
    SET_TOKEN: (state: UserState, token: string) => {
      state.token = token;
      setStoredToken(token);
    },
    REMOVE_TOKEN: (state: UserState) => {
      state.token = null;
      removeStoredToken();
    },

    SET_USERKEY: (state: UserState, userkey: string) => {
      state.userkey = userkey;
      setStoredUserKey(userkey);
    },
    REMOVE_USERKEY: (state: UserState) => {
      state.userkey = null;
      removeStoredUserKey();
    },
    SET_USER: (state: UserState, data: any) => {
      const userData: UserInfo = {
        ID: data.ID ?? null,
        LoginName: data.LoginName ?? null,
        UserName: data.UserName ?? null,
        // Add other properties as needed with the nullish coalescing operator
      };
      state.user = userData;
    },
    REMOVE_USER: (state: UserState) => {
      state.user = null;
    },
  },
  actions: {
    login(
      { commit }: any,
      payload: {
        username: string;
        password: string;
        code: string;
        codeid: string;
      }
    ) {
      const param = {
        Data: {
          LoginName: payload.username,
          Pwd: payload.password,
          Code: payload.code,
          CodeID: payload.codeid,
        },
      };
      return new Promise<void>((resolve, reject) => {
        apiLogin(param)
          .then((response: ResponseObject) => {
            commit("SET_USER", response.Data);
            commit("SET_USERKEY", response.Data?.LoginName ?? "");
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    refreshToken(
      { commit }: VuexContext,
      payload: {
        username: string;
        password: string;
      }
    ) {
      return new Promise<void>((resolve, reject) => {
        getToken(payload.username, payload.password)
          .then((response) => {
            //console.log(response);
            commit("SET_TOKEN", response.data.access_token);
            resolve();
          })
          .catch((error) => {
            console.log(error);
            //logout();
            reject(error);
          });
      });
    },
    // get user info
    getInfo({ commit, state }: VuexContext) {
      const param = {
        Data: {
          LoginName: state.userkey,
        },
      };
      //console.log("getInfo" + param);
      return new Promise<void>((resolve, reject) => {
        if (state.userkey) {
          apiGetUser(param)
            .then((response) => {
              const user = response.Data?.User;
              commit("SET_USER", user);
              ////根据权限显示菜单
              // const list = router.options.routes;
              //filterAsyncRoutes(list, user);
              //commit("SET_ROUTES", list);
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject("获取用户信息失败, 请重新登录.");
        }
      });
    },
    // user logout
    logout({ commit }: any) {
      return new Promise<void>((resolve) => {
        commit("REMOVE_TOKEN");
        commit("REMOVE_USERKEY");
        commit("REMOVE_USER");
        //dispatch("tagsview/delAllViews", null, { root: true });
        resolve();
      });
    },

    quit({ commit }: any) {
      return new Promise<void>((resolve) => {
        commit("REMOVE_TOKEN");
        commit("REMOVE_USERKEY");
        commit("REMOVE_USER");
        resolve();
      });
    },
  },
  getters: {},
};

export default moduleUser;
