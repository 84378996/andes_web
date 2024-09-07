import request from "@/request";
import { PaginationBase, RequestObject, ResponseObject } from "./interface";

export interface GasDevice {
  id?: number | null;
  no?: string | null;
  name?: string | null;
  imei?: string | null;
  createtime?: string | null;
  deleted?: number | null;
  unit?: number | null;
  jd?: number | null;
  thresholdmin?: number | null;
  thresholdmax?: number | null;
  value?: number | null;
  lastrecordtime?: string | null;
}

export function apiGetDevices(data: RequestObject) {
  return request({
    url: "/Test/GetDevices",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
