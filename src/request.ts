import axios from "axios";
import store from "@/store";

import { removeStoredToken, removeStoredUserKey } from "@/api/localstorage";

// create an axios instance
const service = axios.create({
  baseURL: "/api",
  //baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is send
    if (store.getters.token) {
      config.headers.Authorization = "bearer " + store.getters.token;
      config.headers.JNOne = "Authorization";
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.Code === "0") {
      return res;
    } else {
      return Promise.reject(res);
    }
  },
  (error) => {
    console.log(error);
    if (error.response?.status) {
      switch (error.response.status) {
        case 401:
          // 清除token信息并跳转到登录界面
          console.log("removeToken");

          removeStoredToken();
          removeStoredUserKey();
          location.reload();
          break;
        case 500:
          // router.push({ path: "/500" });
          break;
        default:
          break;
      }
    }
    const rsp = { Code: error.code, Msg: error.message };
    return Promise.reject(rsp);
  }
);

export default service;
