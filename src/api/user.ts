import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";

export interface UserCondition extends PaginationBase {
  ID?: number | null;
  LoginName?: string | null;
  Name?: string | null;
  Enabled?: number | null;
}

export interface UserInfo {
  ID?: number | null;
  // 登录名
  LoginName?: string | null;
  // 用户名
  Name?: string | null;
  // 用户密码
  Password?: string | null;
  // 角色
  RoleID?: number | null;
  // 创建时间
  CreateTime?: string | null;
  // 备注
  Remark?: string | null;
  // 启用/禁用
  Enabled?: number | null;
  // 头像文件名
  AvatarName?: string | null;
  RoleName?: string | null;
  AvatarHttp?: string | null;
}

export function resetUserInfo(data: UserInfo) {
  data.ID = null;
  data.LoginName = null;
  data.Name = null;
  data.Password = null;
  data.Remark = null;
  data.Enabled = null;
  data.CreateTime = null;
  data.RoleID = null;
  data.RoleName = null;
}

export function getImagecode() {
  return request({
    url: "/User/GetImageCode",
    method: "get",
  }) as Promise<ResponseObject>;
}

export function apiLogin(data: RequestObject) {
  return request({
    url: "/User/Login",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetUser(data: RequestObject) {
  return request({
    url: "/User/Get",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiLogout() {
  return request({
    url: "/User/Logout",
    method: "post",
  }) as Promise<ResponseObject>;
}

export function apiGetUsers(data: RequestObject) {
  return request({
    url: "/User/Gets",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiModifyUser(data: RequestObject) {
  return request({
    url: "/User/Modify",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiAddUser(data: RequestObject) {
  return request({
    url: "/User/Add",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiDelUser(data: RequestObject) {
  return request({
    url: "/User/Delete",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiExportUser(data: RequestObject) {
  return request({
    url: "/User/Export",
    method: "get",
    params: data,
  }) as Promise<ResponseObject>;
}
