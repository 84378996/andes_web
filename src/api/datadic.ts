import request from "@/request";
import { ResponseObject } from "@/api/interface";

export interface DisplayCycleTime {
  //设备监控循环时间
  Monitor?: number | null;

  //任务循环时间
  Task?: number | null;

  KanBan?: number | null;
  KanBanTask?: number | null;
  KanBanMonitor?: number | null;
}

export function apiGetDisplayCycleTime() {
  return request({
    url: "/DataDic/GetDisplayCycleTime",
    method: "get",
  }) as Promise<ResponseObject>;
}
