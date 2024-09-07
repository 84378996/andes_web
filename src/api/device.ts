import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";

export interface DeviceCondition extends PaginationBase {
  ID?: number | null;
  DevText?: string | null;
  Enabled?: number | null;
}

export interface DeviceInfo {
  ID?: number | null;
  DevText?: string | null;
  DevName?: string | null;
  DevType?: string | null; /// 设备类型
  Enabled?: number | null; /// 1：正常   2：维修中 3：报废  4：闲置
  IP?: string | null; /// IP地址
  FtpHost?: string | null;
  FtpPort?: number | null;
  FtpUser?: string | null;
  FtpPwd?: string | null;
  AddTime?: string | null;
  OperID?: number | null;
  OperName?: string | null;
  Remark?: string | null;

  FtpRoot?: string | null;
  Test?: boolean | null;
  Url1?: string | null;
  Url2?: string | null;
  Url3?: string | null;
  Url4?: string | null;
}

export function resetDeviceInfo(data: DeviceInfo) {
  data.ID = null;
  data.DevText = null;
  data.DevType = null;
  data.Enabled = null;
  data.IP = null;
  data.FtpHost = null;
  data.FtpPort = null;
  data.FtpUser = null;
  data.FtpPwd = null;
  data.AddTime = null;
  data.OperID = null;
  data.OperName = null;
  data.Remark = null;

  data.FtpRoot = null;
  data.Test = null;
  data.Url1 = null;
  data.Url2 = null;
  data.Url3 = null;
  data.Url4 = null;
}

export function apiGetDeviceOptions(data: RequestObject) {
  return request({
    url: "/Device/GetOptions",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetDevices(data: RequestObject) {
  return request({
    url: "/Device/Gets",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetDevice(data: RequestObject) {
  return request({
    url: "/Device/Get",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiAddDevice(data: RequestObject) {
  return request({
    url: "/Device/Add",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiDelDevice(data: RequestObject) {
  return request({
    url: "/Device/Delete",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiModifyDevice(data: RequestObject) {
  return request({
    url: "/Device/Modify",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function exportDevice(data: RequestObject) {
  return request({
    url: "/Device/Export",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
