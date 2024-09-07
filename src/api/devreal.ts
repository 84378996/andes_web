import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";

import { AlarmData } from "./devalarm";

export interface WMSCell {
  column?: number;
  row?: number;
  material?: string;
  length?: string;
  width?: string;
  thickness?: string;
  num?: number;
  type?: number;
  TaskLine?: number;
  TaskLineName?: string;
}

export interface WMSData {
  DevStatus?: string | null;
  DevMode?: string | null;
  Cells?: WMSCell[] | null;
  Errors?: AlarmData[] | null;
}

export interface DeliveryData {
  DeviceStatus?: string | null;
  TaskStatus?: number | null;
  DeviceMode?: number | null;
  DeviceGetWorkZone1?: number | null;
  DeviceLoading1?: number | null;
  DeviceUnLoading1?: number | null;
  DevicePutWork1?: number | null;
  DeviceGetWorkZone2?: number | null;
  DeviceLoading2?: number | null;
  DeviceUnLoading2?: number | null;
  DevicePutWork2?: number | null;
  Errors?: AlarmData[] | null;

  CreateTime?: string | null;
}

export interface MarkerData {
  DevStatus?: string | null;
  DevMode?: number | null;
  CurrentProg?: string | null;
  // 运行累计时间
  RunTotalTime?: number | null;
  // 故障累计时间
  RunFaultTime?: number | null;
  // 待机累计时间
  RunStandbyTime?: number | null;
  // 工作累计时间
  RunWorkingTime?: number | null;
  // 实时电表度数
  PowerReal?: number | null;
  // 日耗电度数
  PowerDay?: number | null;
  // 月耗电度数
  PowerMonth?: number | null;
  // 年耗电度数
  PowerYear?: number | null;
  // 日钢板数量
  SteelDay?: number | null;
  // 月钢板数量
  SteelMonth?: number | null;
  // 年钢板数量
  SteelYear?: number | null;
  // 日喷码数量
  CodeDay?: number | null;
  // 月喷码数量
  CodeMonth?: number | null;
  // 年喷码数量
  CodeYear?: number | null;
  // 日喷码OK数量
  CodeOkDay?: number | null;
  // 月喷码OK数量
  CodeOkMonth?: number | null;
  // 年喷码OK数量
  CodeOkYear?: number | null;
  // 日喷码NG数量
  CodeNgDay?: number | null;
  // 月喷码NG数量
  CodeNgMonth?: number | null;
  // 年喷码NG数量
  CodeNgYear?: number | null;
  // 单张钢板已打码数量
  PlateCodeTotal?: number | null;
  // 单张钢板已打码OK数量
  PlateCodeOk?: number | null;
  // 单张钢板已打码NG数量
  PlateCodeNg?: number | null;
  // 单张钢板打码耗时（秒）
  PlateCodeUse?: number | null;
  // 当日打码OK良率
  RateCurrentDay?: number | null;
  // 当月打码OK良率
  RateCurrentMonth?: number | null;
  // 当年打码OK良率
  RateCurrentYear?: number | null;
  // 当张打码OK良率
  RateCurrentPlate?: number | null;
  // 日钢板打码耗时
  UseTimeDay?: number | null;
  // 月钢板打码耗时
  UseTimeMonth?: number | null;
  // 年钢板打码耗时
  UseTimeYear?: number | null;

  Errors?: AlarmData[] | null;
  CreateTime?: string | null;
}

export interface LaserData {
  DevStatus?: string | null;
  DevMode?: number | null;
  CutProg?: string | null;
  Material?: string | null;
  Thick?: number | null;
  Length?: number | null;
  Width?: number | null;
  CutLength?: number | null;
  CutTime?: string | null;
  DoneNum?: number | null;
  MachineX?: number | null;
  MachineY?: number | null;
  Errors?: AlarmData[] | null;
}

export interface DeviceGroup {
  DeviceID: number | null;
  DeviceName?: string | null;
  Online?: boolean | null;
  IsAlarm?: boolean | null;
  LaserData?: LaserData | null;
  MarkerData?: MarkerData | null;
  DeliveryData?: DeliveryData | null;
  WMSData?: WMSData | null;
}

export function WMSCellTypeStr(type: number | undefined | null) {
  if (type === undefined) return "";
  if (type === null) return "";

  if (type === 0) return "empty";
  else if (type === 1) return "raw";
  else if (type === 2) return "surplus";
  else if (type === 3) return "finished";

  return type.toString();
}

export function DeviceModeStr(mode: number | undefined | null) {
  if (mode === undefined) return "";
  if (mode === null) return "";

  return mode.toString();
}

export function DeliveryStatusStr(status: string | undefined | null) {
  if (status === undefined) return "";
  if (status === null) return "";

  // if (status === 0) return "空闲";
  // else if (status === 1) return "运行";
  // else if (status === 2) return "故障";
  // else if (status === 3) return "暂停";
  //else return status?.toString();
  return status;
}

export function DeliveryWorkingStr(data: DeliveryData | undefined | null) {
  if (data === undefined) return "";
  if (data === null) return "";
  let str = "";

  if (data.DeviceGetWorkZone1 === 1) str = str + "1号台车取料中;";
  if (data.DeviceLoading1 === 1) str = str + "1号机上料中;";
  if (data.DeviceUnLoading1 === 1) str = str + "1号机下料中;";
  if (data.DevicePutWork1 === 1) str = str + "1号区卸料中;";

  if (data.DeviceGetWorkZone2 === 1) str = str + "2号台车取料中;";
  if (data.DeviceLoading2 === 1) str = str + "2号机上料中;";
  if (data.DeviceUnLoading2 === 1) str = str + "2号机下料中;";
  if (data.DevicePutWork2 === 1) str = str + "2号区卸料中;";

  return str;
}

export function apiGetWMS(data: RequestObject) {
  return request({
    url: "/DevRealData/GetWMS",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetDelivery(data: RequestObject) {
  return request({
    url: "/DevRealData/GetDelivery",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetMarker(data: RequestObject) {
  return request({
    url: "/DevRealData/GetMarker",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetLaser(data: RequestObject) {
  return request({
    url: "/DevRealData/GetLaser",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetAll(data: RequestObject) {
  return request({
    url: "/DevRealData/Get",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
