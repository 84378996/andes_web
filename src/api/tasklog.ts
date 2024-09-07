import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";

export interface Log {
  ID?: number | null;

  TaskID?: number | null;

  SendID?: number | null;

  RecvID?: number | null;
  //手自动
  IsAutoMode?: number | null;

  //动作
  Action?: number | null;

  ActionData?: string | null;

  Remark?: string | null;

  AddTime?: string | null;
  TaskLine?: number | null;
  TaskNo?: string | null;

  TaskLineName?: string | null;

  SendName?: string | null;

  RecvName?: string | null;
}

export interface TaskLogCondition extends PaginationBase {
  ID?: number | null;
  StartTime?: string | null;
  EndTime?: string | null;
  TaskLine?: number | null;
  TaskNo?: string | null;
}

export function apiGetTaskLogs(data: RequestObject) {
  return request({
    url: "/Log/GetTaskLogs",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
