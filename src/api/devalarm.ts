import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";

export interface AlarmData {
  ID?: number | null;
  DevID?: number | null;
  DevName?: string | null;
  AlarmType?: string | null;
  AlarmID?: string | null;
  AlarmMessage?: string | null;
  StartTime?: string | null;
  EndTime?: string | null;
}

export interface AlarmCondition extends PaginationBase {
  ID?: number | null;
  DevID?: number | null;
  StartTime?: string | null;
  EndTime?: string | null;
}

export function alarmArrStr(arr: AlarmData[] | undefined | null) {
  if (arr === undefined) return "";
  if (arr === null) return "";

  const str = arr
    .map((item) => `${item.AlarmID},${item.AlarmMessage}`)
    .join(";");
  return str;
}

export function alarmStr(item: AlarmData | undefined | null) {
  if (item === undefined) return "";
  if (item === null) return "";
  const str = `${item.AlarmID},${item.AlarmMessage}`;
  return str;
}

export function isAlarm(arr: AlarmData[] | undefined | null) {
  if (arr === undefined) return false;
  if (arr === null) return false;
  if (arr.length > 0) return true;
  else return false;
}

export function apiGetAlarms(data: RequestObject) {
  return request({
    url: "/Log/GetAlarms",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
