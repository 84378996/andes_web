import request from "@/request";
import { RequestObject, ResponseObject } from "@/api/interface";
import { PaginationBase } from "./interface";
export interface FileCondition extends PaginationBase {
  Path?: string;
  Encoding?: string;
}

export interface FileItem {
  Name?: string | null;
  FullName?: string | null;
  Size?: number | null;
  Type?: number | null;
  LastWriteTime?: string | null;
  hasChildren?: boolean;
  Children?: FileItem[];
}

export function apiGetFileList(data: RequestObject) {
  return request({
    url: "/File/GetFileList",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiDeleteFiles(data: RequestObject) {
  return request({
    url: "/File/DeleteFiles",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetDeviceFileList(data: RequestObject) {
  return request({
    url: "/File/GetDeviceFileList",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiDeleteDeviveFiles(data: RequestObject) {
  return request({
    url: "/File/DeleteDeviveFiles",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetTaskFiles(data: RequestObject) {
  return request({
    url: "/File/GetTaskFiles",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiReadCutFileHeader(data: RequestObject) {
  return request({
    url: "/File/ReadCutFileHeader",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiReadFile(data: RequestObject) {
  return request({
    url: "/File/ReadFile",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
