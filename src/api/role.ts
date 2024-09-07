import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";

export interface RoleCondition extends PaginationBase {
  ID?: number | null;
  RoleName?: string | null;
  Enabled?: number | null;
}

export interface RoleInfo {
  ID?: number | null;
  // 角色名
  RoleName?: string | null;
  Enabled?: number | null;
  AddTime?: string | null;
  Remark?: string | null;
  PurviewList?: string[] | null;
  MenuList?: string[] | null;
  Purview?: string | null;
  Menu?: string | null;
}

export interface Purview {
  Label: string | null;
  Key: string | null;
  Value: string | null;
  Children?: Purview[] | null;
}

export function resetRoleInfo(data: RoleInfo) {
  data.ID = null;
  data.RoleName = "";
  data.Remark = "";
  data.Enabled = 0;
  data.AddTime = "";
  data.PurviewList = [];
  data.MenuList = [];
  data.Purview = "";
  data.Menu = "";
}

export function apiGetRole(data: RequestObject) {
  return request({
    url: "/Role/Get",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiAddRole(data: RequestObject) {
  return request({
    url: "/Role/Add",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetRoles(data: RequestObject) {
  return request({
    url: "/Role/Gets",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiModifyRole(data: RequestObject) {
  return request({
    url: "/Role/Modify",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiDelRole(data: RequestObject) {
  return request({
    url: "/Role/Delete",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiExportRole(data: RequestObject) {
  return request({
    url: "/Role/Export",
    method: "get",
    params: data,
  }) as Promise<ResponseObject>;
}

export function apiGetPurviewOptions(data: RequestObject) {
  return request({
    url: "/Role/GetPurviewOptions",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetRoleOptions(data: RequestObject) {
  return request({
    url: "/Role/GetRoleOptions",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
