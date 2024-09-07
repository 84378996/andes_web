export interface UserInfo {
  ID: number | null;
  LoginName: string | null;
  UserName: string | null;
}

export interface ResponseObject {
  Code?: string | null;
  Msg?: string | null;
  Succeed?: boolean | null;
  Data?: any | null;
  Array?: any[] | null;
}

export interface RequestObject {
  Params?: string | null;
  OperID?: number | null;
  Data?: any | null;
  Array?: any[] | null;
}

export interface Purview {
  show: boolean;
  key: string;
}

import { RouteMeta } from "vue-router";
export interface CustomRouteMeta extends RouteMeta {
  // 每个路由都必须声明
  requiresAuth?: boolean;
  title?: string;
  icon?: string;
  menuup?: boolean; //当只有一个children时，是否将子集提出来
  visible?: boolean;
  purview?: Purview;
  cache?: boolean;
  affix?: boolean;
}

//dialog 回调
export interface DialogResult {
  show?: boolean;
  refresh?: boolean;
}

import { Commit } from "vuex"; // Import the Commit type from Vuex
// Define the type for the context object
export interface VuexContext {
  commit: Commit;
  state: any;
  // Add other properties as needed
}

export interface PaginationBase {
  PageIndex?: number;
  PageSize?: number;
}

export interface KeyValuePair {
  Key?: number | null;
  Value?: string | null;
}
