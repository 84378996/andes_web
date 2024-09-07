import request from "@/request";
import { PaginationBase, RequestObject, ResponseObject } from "./interface";
import { WMSCell } from "./devreal";
export interface TaskListCondition extends PaginationBase {
  ID?: number | null;
  TaskLine?: number | null;
  StartTime?: string | null;
  EndTime?: string | null;
  Status?: number | null;
  StatusList?: number[];
  TaskNo?: string | null;
}

export interface TaskCutCondition extends PaginationBase {
  ID?: number | null;
  TaskID?: number | null;
}

export enum ETaskItemClass {
  Idle = "taskresult-idle",
  Running = "taskresult-running",
  preProcess = "preProcess",
  warning = "warning",
  danger = "danger",
  Disable = "taskresult-disable",
  Success = "taskresult-success",
}

export enum ETaskItemIndex {
  Start = 0, //启动
  SendFile = 1, //下发切割文件
  MaterialOut = 2, //料库出库
  Marking = 3, //打码
  MaterialFeed = 4, //上料
  WorkTable = 5,
  Cutting = 6, //切割
  MaterialBlank = 7, //下料
  End = 8,
}

export enum ETaskListStatus {
  Default = 0, //已添加，未执行
  Active = 1, //已激活
  Start = 2, //已启动

  Completed = 3, //已完成
}
export enum ETaskCutStatus {
  Default = 0, //已添加，未执行
  Active = 1, //已激活
  Start = 2, //已启动
  Completed = 3, //已完成
}

export interface TaskCut {
  ID?: number | null;
  TaskName?: string | null;
  Path?: string | null;
  Material?: string | null;
  Length?: string | null;
  Width?: string | null;
  Thickness?: string | null;
  FinishCount?: number | null;
  TotalCount?: number | null;
  FeedCount?: number | null;
  AddTime?: string | null;
  FinishTime?: string | null;
  Status?: number | null;
  TaskNo?: string | null;
  TaskID?: number | null;
  Sort?: number | null;
  TaskListName?: string | null;
  Remark?: string | null;
  IsSendFile?: boolean;
}

export interface TaskCutList {
  ID?: number | null;
  TaskLine?: number | null;
  //任务号唯一
  TaskNo?: string | null;
  //任务添加时间
  AddTime?: string | null;
  //任务开始时间
  StartTime?: string | null;
  //任务结束时间
  FinishTime?: string | null;
  Status?: number | null;
  Remark?: string | null;
  TaskCuts?: TaskCut[];
  //统计
  TaskCutCount?: number | null;
  FinishCount?: number | null;
  TotalCount?: number | null;
  FeedCount?: number | null;
  CurrentTaskCutID?: number | null;
  TaskLineName?: string | null;
  SendFileCount?: number | null;
}

export enum EOpStatus {
  Idle = 0,
  Running = 1,
  Done = 2,
}

export enum EWorkTableStatus {
  Idle = 0, //空
  UnDone = 1, //有板，没有切割
  Done = 2, //有板，切割完成
}

export interface WorkFlowStatus {
  // 首次启动
  IsFirstCycle?: boolean;
  //任务列表使能
  Enable?: boolean;
  //任务是否运行中
  IsRunning?: boolean;
  //是否激活
  IsActive?: boolean;
  // 自动模式/手动模式
  IsAutoMode?: boolean;
  // 文件下发完成
  IsFilesTransFinish?: number;
  IsFileSendFinish?: number;
  // 打码完成
  IsMarkFinish?: number;
  // 切割完成
  IsCutFinish?: number;
  // 工作台上料完成
  IsFeedOk?: number;
  // 工作台下料完成
  IsBlankOk?: number;
  // 交换工作台锁定
  IsWorkTableLock?: boolean;
  // 工作台交换完成
  IsWorkTableSwitchOk?: number;
  //是否暂停状态
  IsPauseState?: boolean;
  //料库托盘出库
  IsPalletOutOk?: number;
  //托盘入库
  IsPalletInOk?: number;
  // 当前切割的前工作台状态
  FrontWorkTable?: number;
  // 当前切割的后工作台状态
  BehindWorkTable?: number;
  //料库原料托盘出库是否完成
  IsMaterialOutOk?: number;
  //料库原料托盘入库是否完成
  IsMaterialInOk?: number;
  //料库成品托盘入库是否完成
  IsProductInOk?: number;
  //是否列表所有任务都完成
  IsTaskListAllFinish?: boolean;
  //料库成品托盘出库是否完成
  IsProductOutOk?: number;
}

export interface TaskGroup {
  TaskLine?: number;
  TaskLineName?: string | null;
  TaskCurrent?: TaskCutList | null;
  TaskCutCurrent?: TaskCut | null;
  WorkFlow?: WorkFlowStatus | null;

  //buttons?: boolean[];
  loading?: boolean;
  //任务进度（百分比)
  Percentage?: number;

  MaterialOutCell?: WMSCell | null;
  ProductInCell?: WMSCell | null;
  IsMaterialOutDone?: boolean;
  IsProductInDone?: boolean;
}

//TaskCutList Status
export function TaskListStatusStr(status: number | undefined | null) {
  if (status === undefined) return "";
  if (status === null) return "";

  if (status === ETaskListStatus.Default) return "未执行";
  else if (status === ETaskListStatus.Active) return "已激活";
  else if (status === ETaskListStatus.Start) return "已启动";
  else if (status === ETaskListStatus.Completed) return "已完成";
  else return "";
}
//TaskCutList Status
export function TaskListStatusType(status: number | undefined | null) {
  if (status === undefined) return "";
  if (status === null) return "";

  if (status === ETaskListStatus.Default) return "";
  else if (status === ETaskListStatus.Active) return "warning";
  else if (status === ETaskListStatus.Start) return "primary";
  else if (status === ETaskListStatus.Completed) return "success";
  else return "";
}

//TaskCutList Status
export function TaskStatusStr(task: TaskGroup) {
  if (task.WorkFlow === undefined) return "";
  if (task.WorkFlow === null) return "";

  let str = "";
  if (task.WorkFlow.Enable === false) {
    str = str + "使能关闭";
    return str;
  }
  if (task.WorkFlow.IsActive === true) str = str + "已激活;";
  if (task.WorkFlow.IsRunning === true) str = str + "已启动;";

  if (task.WorkFlow.IsPauseState === true) str = str + "已暂停;";
  if (task.WorkFlow.IsTaskListAllFinish === true) str = str + "已完成;";

  return str;
}
//TaskCutList Status
export function TaskStatusType(task: TaskGroup) {
  if (task.WorkFlow === undefined) return "";
  if (task.WorkFlow === null) return "";

  let str = "";
  if (task.WorkFlow.Enable === false) {
    return "";
  }

  if (task.WorkFlow.IsActive === true) str = "warning";
  if (task.WorkFlow.IsRunning === true) str = "warning";

  if (task.WorkFlow.IsPauseState === true) str = "warning";

  if (task.WorkFlow.IsTaskListAllFinish === true) str = "success";

  return str;
}

//是否能手自动切换
export function canAutoMode(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.WorkFlow.IsRunning === false) return true;

  return false;
}

export function canActivate(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.WorkFlow.IsRunning === true) return false;
  if (task.WorkFlow.IsActive === false) return true;

  //数据异常,
  if (task.TaskCurrent === undefined) return false;
  if (task.TaskCurrent === null) return false;

  if (
    task.TaskCurrent.Status == ETaskListStatus.Default ||
    task.TaskCurrent.Status == ETaskListStatus.Active ||
    task.TaskCurrent.Status == ETaskListStatus.Completed
  )
    return true;

  return false;
}
export function canCancelActivate(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.WorkFlow.IsRunning === true) return false;
  if (task.WorkFlow.IsActive === false) return false;
  return true;
}
export function canStart(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.TaskCurrent === undefined) return false;
  if (task.TaskCurrent === null) return false;

  if (
    task.WorkFlow.IsRunning &&
    task.WorkFlow.IsActive &&
    task.WorkFlow.IsPauseState
  )
    return true;

  if (task.WorkFlow.IsRunning) return false;
  if (task.WorkFlow.IsActive === false) return false;

  if (task.TaskCurrent.Status === ETaskListStatus.Active) return true;

  return false;
}

export function classStart(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;

  if (task.TaskCurrent === undefined) return ETaskItemClass.Disable;
  if (task.TaskCurrent === null) return ETaskItemClass.Disable;

  if (task.WorkFlow.IsRunning === true) return ETaskItemClass.Idle;

  return ETaskItemClass.Disable;
}

export function canPause(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.WorkFlow.IsRunning === false) return false;

  if (task.WorkFlow.IsPauseState === false) return true;

  return false;
}

export function canReset(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.WorkFlow.IsRunning === false) return false;

  if (task.WorkFlow.IsPauseState === true) return true;

  return false;
}

export function canStop(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.WorkFlow.IsRunning === true) return true;

  return false;
}

export function canSendFile(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.WorkFlow.IsRunning === false) return false;

  if (task.WorkFlow.IsFilesTransFinish === EOpStatus.Done) return false;
  if (
    task.WorkFlow.IsFileSendFinish === EOpStatus.Idle ||
    task.WorkFlow.IsFileSendFinish === EOpStatus.Done
  )
    return true;

  return false;
}

export function classSendFile(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;

  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  //下发切割文件
  if (task.WorkFlow.IsFilesTransFinish === EOpStatus.Idle) {
    return ETaskItemClass.Idle;
  } else if (task.WorkFlow.IsFilesTransFinish === EOpStatus.Running)
    return ETaskItemClass.Running;
  else if (task.WorkFlow.IsFilesTransFinish === EOpStatus.Done)
    return ETaskItemClass.Success;

  return ETaskItemClass.Disable;
}

export function canMaterialIn(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;

  if (task.TaskCurrent === undefined) return false;
  if (task.TaskCurrent === null) return false;

  if (task.WorkFlow.IsRunning === undefined) return false;

  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsMaterialOutOk === EOpStatus.Running ||
    task.WorkFlow.IsMaterialInOk === EOpStatus.Running
  )
    return false;
  return true;
}

export function canMaterialOut(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.TaskCurrent === undefined) return false;
  if (task.TaskCurrent === null) return false;

  if (task.WorkFlow.IsRunning === undefined) return false;

  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsMaterialOutOk === EOpStatus.Running ||
    task.WorkFlow.IsMaterialInOk === EOpStatus.Running
  )
    return false;

  return true;
}

export function classMaterialOut(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  if (task.WorkFlow.IsMaterialOutOk === EOpStatus.Running)
    return ETaskItemClass.Running;

  if (task.WorkFlow.IsMaterialInOk === EOpStatus.Running)
    return ETaskItemClass.Running;

  if (task.IsMaterialOutDone === true) return ETaskItemClass.Success;

  if (
    task.WorkFlow.IsMaterialInOk === EOpStatus.Idle ||
    task.WorkFlow.IsMaterialInOk === EOpStatus.Idle
  )
    return ETaskItemClass.Idle;

  return ETaskItemClass.Disable;
}

export function canMarking(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsMarkFinish === EOpStatus.Idle ||
    task.WorkFlow.IsMarkFinish === EOpStatus.Done
  )
    return true;
  return false;
}

export function classMarking(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  //打码
  if (task.WorkFlow.IsMarkFinish === EOpStatus.Idle) {
    return ETaskItemClass.Idle;
  } else if (task.WorkFlow.IsMarkFinish === EOpStatus.Running)
    return ETaskItemClass.Running;
  else if (task.WorkFlow.IsMarkFinish === EOpStatus.Done)
    return ETaskItemClass.Success;

  return ETaskItemClass.Disable;
}

export function canCutting(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsCutFinish === EOpStatus.Idle ||
    task.WorkFlow.IsCutFinish === EOpStatus.Done
  )
    return true;
  return false;
}

export function classCutting(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  //切割
  if (task.WorkFlow.IsCutFinish === EOpStatus.Idle) {
    return ETaskItemClass.Idle;
  } else if (task.WorkFlow.IsCutFinish === EOpStatus.Running)
    return ETaskItemClass.Running;
  else if (task.WorkFlow.IsCutFinish === EOpStatus.Done)
    return ETaskItemClass.Success;

  return ETaskItemClass.Disable;
}

export function canWorkTableExchange(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (task.WorkFlow.IsWorkTableLock === false) return true;
  return false;
}

export function classWorkTableExchange(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  //工作台
  if (task.WorkFlow.IsWorkTableSwitchOk === EOpStatus.Idle) {
    return ETaskItemClass.Idle;
  } else if (task.WorkFlow.IsWorkTableSwitchOk === EOpStatus.Running)
    return ETaskItemClass.Running;
  else if (task.WorkFlow.IsWorkTableSwitchOk === EOpStatus.Done)
    return ETaskItemClass.Success;

  return ETaskItemClass.Disable;
}

export function canWorkTableLock(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (task.WorkFlow.IsWorkTableLock === false) return true;
  return false;
}

export function canWorkTableUnLock(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (task.WorkFlow.IsWorkTableLock === true) return true;
  return false;
}

export function canMaterialFeed(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsFeedOk === EOpStatus.Idle ||
    task.WorkFlow.IsFeedOk === EOpStatus.Done
  )
    return true;
  return false;
}
export function classMaterialFeed(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  //上料
  if (task.WorkFlow.IsFeedOk === EOpStatus.Idle) {
    return ETaskItemClass.Idle;
  } else if (task.WorkFlow.IsFeedOk === EOpStatus.Running)
    return ETaskItemClass.Running;
  else if (task.WorkFlow.IsFeedOk === EOpStatus.Done)
    return ETaskItemClass.Success;

  return ETaskItemClass.Disable;
}

export function canMaterialBlank(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsBlankOk === EOpStatus.Idle ||
    task.WorkFlow.IsBlankOk === EOpStatus.Done
  )
    return true;
  return false;
}

export function classMaterialBlank(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  //下料
  if (task.WorkFlow.IsBlankOk === EOpStatus.Idle) {
    return ETaskItemClass.Idle;
  } else if (task.WorkFlow.IsBlankOk === EOpStatus.Running)
    return ETaskItemClass.Running;
  else if (task.WorkFlow.IsBlankOk === EOpStatus.Done)
    return ETaskItemClass.Success;

  return ETaskItemClass.Disable;
}

export function canProductIn(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.TaskCurrent === undefined) return false;
  if (task.TaskCurrent === null) return false;
  if (task.WorkFlow.IsRunning === undefined) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsProductInOk === EOpStatus.Running ||
    task.WorkFlow.IsProductOutOk === EOpStatus.Running
  )
    return false;

  return true;
}

export function classProductIn(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  if (task.WorkFlow.IsProductOutOk === EOpStatus.Running)
    return ETaskItemClass.Running;

  if (task.WorkFlow.IsProductInOk === EOpStatus.Running)
    return ETaskItemClass.Running;

  if (task.IsProductInDone === true) return ETaskItemClass.Success;

  if (
    task.WorkFlow.IsProductOutOk === EOpStatus.Idle ||
    task.WorkFlow.IsProductInOk === EOpStatus.Idle
  )
    return ETaskItemClass.Idle;

  return ETaskItemClass.Disable;
}

export function canProductOut(task: TaskGroup): boolean {
  if (task.WorkFlow === undefined) return false;
  if (task.WorkFlow === null) return false;
  if (task.TaskCurrent === undefined) return false;
  if (task.TaskCurrent === null) return false;
  if (task.WorkFlow.IsRunning === undefined) return false;
  if (task.WorkFlow.IsRunning === false) return false;

  if (
    task.WorkFlow.IsProductInOk === EOpStatus.Running ||
    task.WorkFlow.IsProductOutOk === EOpStatus.Running
  )
    return false;
  return true;
}

export function classEnd(task: TaskGroup): string {
  if (task.WorkFlow === undefined) return ETaskItemClass.Disable;
  if (task.WorkFlow === null) return ETaskItemClass.Disable;
  if (task.WorkFlow.IsRunning === false) return ETaskItemClass.Disable;

  if (task.WorkFlow.IsRunning === true) return ETaskItemClass.Idle;
  if (task.WorkFlow.IsTaskListAllFinish === true) return ETaskItemClass.Success;

  return ETaskItemClass.Disable;
}

export function resetTaskCutList(data: TaskCutList) {
  data.ID = null;
  data.TaskLine = null;
  //任务号唯一
  data.TaskNo = "";
  //任务添加时间
  data.AddTime = "";
  //任务开始时间
  data.StartTime = "";
  //任务结束时间
  data.FinishTime = "";
  data.Status = null;
  data.Remark = "";
  data.TaskCuts = [];
  //统计
  data.TaskCutCount = null;
  data.FinishCount = null;
  data.TotalCount = null;
  data.FeedCount = null;
  data.CurrentTaskCutID = null;
}

export function apiAddTask(data: RequestObject) {
  return request({
    url: "/TaskList/AddTask",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiAddTaskCut(data: RequestObject) {
  return request({
    url: "/TaskList/AddTaskCut",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiModifyTaskCut(data: RequestObject) {
  return request({
    url: "/TaskList/ModifyTaskCut",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetTask(data: RequestObject) {
  return request({
    url: "/TaskList/GetTask",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetCurrentTask(data: RequestObject) {
  return request({
    url: "/TaskList/GetCurrentTask",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiModifyTask(data: RequestObject) {
  return request({
    url: "/TaskList/ModifyTask",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiGetTasks(data: RequestObject) {
  return request({
    url: "/TaskList/GetTasks",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiDeleteTask(data: RequestObject) {
  return request({
    url: "/TaskList/DeleteTask",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiDeleteTaskCut(data: RequestObject) {
  return request({
    url: "/TaskList/DeleteTaskCut",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMoveTaskCut(data: RequestObject) {
  return request({
    url: "/TaskList/MoveTaskCut",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiActiveCycle(data: RequestObject) {
  return request({
    url: "/TaskList/ActiveCycle",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiCancelActiveCycle(data: RequestObject) {
  return request({
    url: "/TaskList/CancelActiveCycle",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiStartCycle(data: RequestObject) {
  return request({
    url: "/TaskList/StartCycle",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiSwitchAutoMode(data: RequestObject) {
  return request({
    url: "/TaskList/SwitchAutoMode",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiSendCutFile(data: RequestObject) {
  return request({
    url: "/TaskList/SendCutFile",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiPauseCycle(data: RequestObject) {
  return request({
    url: "/TaskList/PauseCycle",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiResetCycle(data: RequestObject) {
  return request({
    url: "/TaskList/ResetCycle",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiStopCycle(data: RequestObject) {
  return request({
    url: "/TaskList/StopCycle",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialIn(data: RequestObject) {
  return request({
    url: "/TaskList/MaterialIn",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialOut(data: RequestObject) {
  return request({
    url: "/TaskList/MaterialOut",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMarking(data: RequestObject) {
  return request({
    url: "/TaskList/Marking",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialFeed(data: RequestObject) {
  return request({
    url: "/TaskList/MaterialFeed",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialFeedReset(data: RequestObject) {
  return request({
    url: "/TaskList/MaterialFeedReset",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiWorkTableExchange(data: RequestObject) {
  return request({
    url: "/TaskList/WorkTableExchange",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiWorkTableLock(data: RequestObject) {
  return request({
    url: "/TaskList/WorkTableLock",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiCutting(data: RequestObject) {
  return request({
    url: "/TaskList/Cutting",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialBlank(data: RequestObject) {
  return request({
    url: "/TaskList/MaterialBlank",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
export function apiMaterialBlankReset(data: RequestObject) {
  return request({
    url: "/TaskList/MaterialBlankReset",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
export function apiGetTaskLineOptions(data: RequestObject) {
  return request({
    url: "/TaskList/GetTaskLineOptions",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialOutDone(data: RequestObject) {
  return request({
    url: "/Work/MaterialOutDone",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMarkDone(data: RequestObject) {
  return request({
    url: "/Work/MarkDone",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialFeedDone(data: RequestObject) {
  return request({
    url: "/Work/MaterialFeedDone",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiCutDone(data: RequestObject) {
  return request({
    url: "/Work/CutDone",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiWorkTableExchangeDone(data: RequestObject) {
  return request({
    url: "/Work/WorkTableExchangeDone",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiMaterialBlankDone(data: RequestObject) {
  return request({
    url: "/Work/MaterialBlankDone",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiProductIn(data: RequestObject) {
  return request({
    url: "/TaskList/ProductIn",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiProductOut(data: RequestObject) {
  return request({
    url: "/TaskList/ProductOut",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}

export function apiSetMaterialCell(data: RequestObject) {
  return request({
    url: "/TaskList/SetMaterialCell",
    method: "post",
    data,
  }) as Promise<ResponseObject>;
}
