import request from "@/request";
import { PaginationBase, RequestObject, ResponseObject } from "./interface";

export interface DeviceCondition extends PaginationBase {
  ID?: number | null;
  DeviceNo?: string | null; //设备型号
  StartTime?: string | null;
  EndTime?: string | null;
  Status?: number | null;
}

export interface GasDevice {
  ID?: number | null; //主键
  DeviceNo?: string | null; //设备型号
  DeviceName?: string | null; //设备名称
  IMEI?: string | null; //imei码
  CreateTime?: string | null; //添加时间
  Deleted?: number | null; //0,未删除（默认），1已删除
  Unit?: number | null; //气体单位 0(%LEL)，1(PPM)，2(%VOL)
  JD?: number | null; //显示精度，0（浓度值*1），1（浓度值*0.1），2（浓度值*0.01）， 3（浓度值*0.001）
  ThresholdMin?: number | null; //低报值
  ThresholdMax?: number | null; //高报值
  TheValue?: number | null; //浓度值
  LastRecordTime?: string | null; //最近采集数据时间
  CurrentValue?: string | null; //格式化后的浓度数据
  OnlineStatus?: string | null; //在线状态
}

// Record Data Structure
export interface DeviceRecord {
  ID?: number | null; //主键，编号
  DeviceID?: number | null; //设备ID
  DeviceName?: string | null; //设备名称
  Unit?: number | null; //气体单位 0(%LEL)，1(PPM)，2(%VOL)
  JD?: number | null; //显示精度，0（浓度值*1），1（浓度值*0.1），2（浓度值*0.01）， 3（浓度值*0.001）
  ThresholdMin?: number | null; //低报值
  ThresholdMax?: number | null; //高报值
  TheValue?: number | null; //浓度值
  RecordTime?: string | null; //数据录入时间
  CurrentValue?: string | null; //格式化后的浓度数据
}

export function resetDeviceInfo(data: GasDevice) {
  data.ID = null;
  data.DeviceNo = null;
  data.DeviceName = null;
  data.IMEI = null;
  data.Deleted = null;
  data.OnlineStatus = null;
  data.CreateTime = null;
  data.CurrentValue = null;
  data.OnlineStatus = null;
}

export function apiGetDevices(data: RequestObject) {
  return request({
    url: "/Device/GetDevices",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetDevice(data: RequestObject) {
  return request({
    url: "/Device/GetDevice",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetDeviceRecords(data: RequestObject) {
  return request({
    url: "/Device/GetDeviceRecords",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
