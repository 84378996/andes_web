import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";

export interface Log {
  ID?: number | null;
  //操作类型
  Type?: number | null;
  // 模块标识
  Module?: number | null;
  // 识别标识符
  Identifier?: string | null;
  // 概述
  Title?: string | null;
  // 操作员
  OperID?: number | null;
  //添加时间
  AddTime?: string | null;
  // 备注
  Remark?: string | null;
  // 操作明细 参数1
  Param1?: string | null;
  // 操作明细 参数2
  Param2?: string | null;
  Status?: number | null;
  UserHostAddress?: string | null;
  TypeStr?: string | null;
  ModuleStr?: string | null;
  OperName?: string | null;
}

export enum ErrorCode {
  Parameter = "1001",
  FileException = "1002",
  DBException = "1104",
  TimeOut = "1107",
  NoPermission = "1110",
  TaskCycle = "1111",
}

export interface LogCondition extends PaginationBase {
  ID?: number | null;
  StartTime?: string | null;
  EndTime?: string | null;
}

export function apiGetLogs(data: RequestObject) {
  return request({
    url: "/Log/Gets",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
