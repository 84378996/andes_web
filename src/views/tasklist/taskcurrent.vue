<template>
  <el-container class="app-container">
    <el-main class="main-container">
      <div class="taskcurrent-container">
        <el-row>
          <el-col :span="8">
            <div class="tasklist">
              <el-descriptions :column="2" border class="descriptions-task">
                <el-descriptions-item label="任务列表">
                  <el-text>{{ task.TaskLineName }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="模式">
                  <div v-if="task.WorkFlow">
                    <el-text v-if="task.WorkFlow?.IsAutoMode">自动模式</el-text>
                    <el-text v-else>手动模式</el-text>
                  </div>
                </el-descriptions-item>

                <el-descriptions-item label="任务号" :span="2">
                  <el-text>{{ task.TaskCurrent?.TaskNo }}</el-text>
                </el-descriptions-item>

                <el-descriptions-item label="状态" :span="2">
                  <el-text :type="TaskStatusType(task)">{{
                    TaskStatusStr(task)
                  }}</el-text>
                </el-descriptions-item>
                <!-- <el-descriptions-item label="文件数">
                  <el-text> {{ task.TaskCurrent?.TaskCutCount }}</el-text>
                </el-descriptions-item> 
                <el-descriptions-item label="钢板数">
                  <el-text> {{ task.TaskCurrent?.TaskCutCount }}</el-text>
                </el-descriptions-item>-->
                <el-descriptions-item label="上料">
                  <el-text> {{ task.TaskCurrent?.FeedCount }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="切割">
                  <el-text> {{ task.TaskCurrent?.FinishCount }}</el-text>
                </el-descriptions-item>
                <el-descriptions-item label="缓冲区" :span="2">
                  <el-text
                    >{{ task.MaterialOutCell?.material + " " }},({{
                      task.MaterialOutCell?.length
                    }}*{{ task.MaterialOutCell?.width }}*{{
                      task.MaterialOutCell?.thickness
                    }}),{{ " " + task.MaterialOutCell?.num + " " }},
                    {{
                      task.IsMaterialOutDone == true ? "托盘存在" : "托盘不存在"
                    }}
                  </el-text>
                </el-descriptions-item>
              </el-descriptions>
              <div style="margin-left: 10px; margin-right: 10px">
                <el-space wrap>
                  <el-button
                    type="primary"
                    :disabled="!canAutoMode(task)"
                    @click="handleAutoMode"
                    v-loading="loading"
                    plain
                  >
                    手动/自动模式</el-button
                  >

                  <el-button
                    type="primary"
                    :disabled="!canActivate(task)"
                    @click="handleActive"
                    v-loading="loading"
                    plain
                    >激活</el-button
                  >

                  <el-button
                    type="primary"
                    :disabled="!canCancelActivate(task)"
                    @click="handleCancelActive"
                    v-loading="loading"
                    plain
                    >取消激活</el-button
                  >
                  <el-button
                    type="primary"
                    :disabled="!canStart(task)"
                    @click="handleStart"
                    v-loading="loading"
                    plain
                    >启动</el-button
                  >

                  <el-button
                    type="primary"
                    :disabled="!canPause(task)"
                    @click="handlePause"
                    v-loading="loading"
                    plain
                    >暂停</el-button
                  >
                  <el-button
                    type="primary"
                    :disabled="!canReset(task)"
                    @click="handleReset"
                    v-loading="loading"
                    plain
                    >复位</el-button
                  >
                  <el-button
                    type="primary"
                    :disabled="!canStop(task)"
                    @click="handleStop"
                    v-loading="loading"
                    plain
                    >停止</el-button
                  >

                  <el-button
                    @click="handleRefresh"
                    v-loading="loading"
                    type="primary"
                    >刷新</el-button
                  >
                </el-space>

                <el-space v-show="false" wrap>
                  <el-button
                    type="primary"
                    icon="Operation"
                    v-loading="loading"
                    @click="handleMaterialOutDone"
                    >出库完成</el-button
                  >
                  <el-button
                    type="primary"
                    icon="Printer"
                    v-loading="loading"
                    @click="handleMarkDone"
                    >打码完成</el-button
                  >
                  <el-button
                    type="primary"
                    icon="DArrowLeft"
                    v-loading="loading"
                    @click="handleMaterialFeedDone"
                    >上料完成</el-button
                  >
                  <el-button
                    type="primary"
                    icon="Switch"
                    v-loading="loading"
                    @click="handleWorkTableExchangeDone"
                    >交换工作台完成</el-button
                  >
                  <el-button
                    type="primary"
                    icon="Crop"
                    v-loading="loading"
                    @click="handleCutDone"
                    >切割完成</el-button
                  >
                  <el-button
                    type="primary"
                    icon="DArrowLeft"
                    v-loading="loading"
                    @click="handleMaterialBlankDone"
                    >下料完成</el-button
                  >
                </el-space>
              </div>
              <el-table
                border
                :data="task.TaskCurrent?.TaskCuts"
                :row-class-name="tableRowClassName"
              >
                <el-table-column
                  label="切割文件"
                  prop="TaskName"
                  show-overflow-tooltip
                >
                </el-table-column>

                <el-table-column label="状态" prop="Status" width="90px" />
                <el-table-column label="上料" prop="FeedCount" width="70px" />
                <el-table-column label="切割" prop="FinishCount" width="70px" />
                <el-table-column label="计划" prop="TotalCount" width="70px" />
              </el-table>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="taskresultdiv">
              <div class="container-space-between">
                <div id="itemStart" ref="itemStartRef">
                  <el-result class="taskresult" :class="classStart(task)">
                    <template #icon>
                      <el-icon :size="40">
                        <VideoPlay />
                      </el-icon>
                    </template>
                    <template #title>
                      <el-button
                        v-if="canStart(task)"
                        type="primary"
                        @click="handleStart"
                        v-loading="loading"
                        plain
                        >启动</el-button
                      >
                      <el-text v-else>启动</el-text>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <div style="width: 150px">
                          <el-text
                            v-if="task.WorkFlow?.IsRunning === true"
                            truncated
                            >{{ task.TaskCutCurrent?.TaskName }}</el-text
                          >
                        </div>
                        <el-text type="info" size="default"
                          >任务列表启动循环</el-text
                        >
                      </el-space>
                    </template>
                  </el-result>
                </div>
                <div id="itemSendFile" ref="itemSendFileRef">
                  <el-result class="taskresult" :class="classSendFile(task)">
                    <template #icon>
                      <el-icon :size="40">
                        <Document />
                      </el-icon>
                    </template>
                    <template #title>
                      <el-button
                        v-if="canSendFile(task)"
                        type="primary"
                        @click="handleSendFile"
                        v-loading="loading"
                        plain
                        >下发切割文件</el-button
                      >
                      <el-text v-else>下发切割文件</el-text>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text>当前发送</el-text>
                        <el-text size="large"
                          >{{ task.TaskCurrent?.SendFileCount }}/{{
                            task.TaskCurrent?.TaskCutCount
                          }}</el-text
                        >

                        <el-text type="info" size="default"
                          >发送切割文件到激光切割机</el-text
                        >
                      </el-space>
                    </template>
                  </el-result>
                </div>
                <div id="itemMaterialOut" ref="itemMaterialOutRef">
                  <el-result class="taskresult" :class="classMaterialOut(task)">
                    <template #icon>
                      <el-button
                        v-if="
                          task.WorkFlow?.IsMaterialOutOk ===
                            EOpStatus.Running ||
                          task.WorkFlow?.IsMaterialInOk === EOpStatus.Running
                        "
                        class="loading"
                        :loading="true"
                      ></el-button>
                      <el-icon v-else :size="40">
                        <Operation />
                      </el-icon>
                    </template>
                    <template #title>
                      <div>
                        <el-button
                          v-if="canMaterialIn(task)"
                          type="primary"
                          @click="handleMaterialIn"
                          v-loading="loading"
                          plain
                          >原料入库</el-button
                        >
                        <el-text v-else>原料入库</el-text>
                      </div>
                      <div style="height: 5px"></div>
                      <div>
                        <el-button
                          v-if="canMaterialOut(task)"
                          type="primary"
                          @click="handleMaterialOut"
                          v-loading="loading"
                          plain
                          >原料出库</el-button
                        >
                        <el-text v-else>料库出库</el-text>
                      </div>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text>{{ task.MaterialOutCell?.num }}</el-text>

                        <el-text type="info" size="default">托盘钢板数</el-text>
                      </el-space>
                    </template>
                  </el-result>
                </div>
                <div id="itemMark" ref="itemMarkRef">
                  <el-result class="taskresult" :class="classMarking(task)">
                    <template #icon>
                      <el-button
                        v-if="task.WorkFlow?.IsMarkFinish === EOpStatus.Running"
                        class="loading"
                        :loading="true"
                      ></el-button>
                      <el-icon v-else :size="40">
                        <Printer />
                      </el-icon>
                    </template>
                    <template #title>
                      <el-button
                        v-if="canMarking(task)"
                        type="primary"
                        @click="handleMarking"
                        v-loading="loading"
                        plain
                        >打码</el-button
                      >
                      <el-text v-else>打码</el-text>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text>打码数量</el-text>
                        <el-text
                          >0/{{ task.TaskCutCurrent?.TotalCount }}</el-text
                        >
                        <el-text type="info" size="default"
                          >当前板材打码</el-text
                        >
                      </el-space>
                    </template>
                  </el-result>
                </div>
              </div>
              <div class="space-height-50"></div>
              <div class="container-space-between">
                <div id="itemCut" ref="itemCutRef">
                  <el-result class="taskresult" :class="classCutting(task)">
                    <template #icon>
                      <el-button
                        v-if="task.WorkFlow?.IsCutFinish === EOpStatus.Running"
                        class="loading"
                        :loading="true"
                      ></el-button>
                      <el-icon v-else :size="40">
                        <Crop />
                      </el-icon>
                    </template>
                    <template #title>
                      <el-button
                        v-if="canCutting(task)"
                        type="primary"
                        @click="handleCutting"
                        v-loading="loading"
                        plain
                        >开始切割</el-button
                      >
                      <el-text v-else>切割</el-text>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text></el-text>
                        <el-text type="info" size="default"
                          >启动切割命令</el-text
                        >
                      </el-space>
                    </template>
                  </el-result>
                </div>
                <div id="itemWorkTable" ref="itemWorkTableRef">
                  <el-space class="divworktable" alignment="flex-start">
                    <div class="worktable" :class="workTableFrontClass"></div>
                    <el-result
                      class="taskresult"
                      :class="classWorkTableExchange(task)"
                    >
                      <template #icon>
                        <el-space>
                          <el-icon
                            :size="40"
                            color="#E6A23C"
                            v-if="task.WorkFlow?.IsWorkTableLock === true"
                          >
                            <Lock />
                          </el-icon>
                          <el-button
                            v-if="
                              task.WorkFlow?.IsWorkTableSwitchOk ===
                              EOpStatus.Running
                            "
                            class="loading"
                            :loading="true"
                          ></el-button>
                          <el-icon v-else :size="40">
                            <Switch />
                          </el-icon>
                        </el-space>
                      </template>
                      <template #title>
                        <div>
                          <el-button
                            v-if="canWorkTableExchange(task)"
                            type="primary"
                            @click="handleWorkTableExchange"
                            v-loading="loading"
                            plain
                            >交换工作台</el-button
                          >
                          <el-button
                            v-else-if="canWorkTableLock(task)"
                            type="primary"
                            @click="handleWorkTableLock"
                            v-loading="loading"
                            plain
                            >锁定</el-button
                          >
                          <el-button
                            v-else-if="canWorkTableUnLock(task)"
                            type="primary"
                            @click="handleWorkTableUnLock"
                            v-loading="loading"
                            plain
                            >解锁</el-button
                          >

                          <el-text v-else>交换工作台</el-text>
                        </div>
                      </template>
                      <template #sub-title>
                        <el-space direction="vertical" alignment="center">
                          <el-text class="subtitle"></el-text>
                          <el-text type="info" size="default"
                            >预切割工作台交换到切割工作台</el-text
                          >
                        </el-space>
                      </template>
                    </el-result>
                    <div class="worktable" :class="workTableBehindClass"></div>
                  </el-space>
                </div>
                <div id="itemMaterialFeed" ref="itemMaterialFeedRef">
                  <el-result
                    class="taskresult"
                    :class="classMaterialFeed(task)"
                  >
                    <template #icon>
                      <el-button
                        v-if="task.WorkFlow?.IsFeedOk === EOpStatus.Running"
                        class="loading"
                        :loading="true"
                      ></el-button>
                      <el-icon v-else :size="40">
                        <DArrowLeft />
                      </el-icon>
                    </template>
                    <template #title>
                      <div>
                        <el-button
                          v-if="canMaterialFeed(task)"
                          type="primary"
                          @click="handleMaterialFeed"
                          v-loading="loading"
                          plain
                          >上料</el-button
                        >
                        <el-text v-else>上料</el-text>
                      </div>
                      <div style="height: 5px"></div>
                      <div>
                        <el-button
                          v-if="canMaterialFeed(task)"
                          type="primary"
                          @click="handleMaterialFeedReset"
                          v-loading="loading"
                          plain
                          >上料复位</el-button
                        >
                        <el-text v-else>上料复位</el-text>
                      </div>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text></el-text>
                        <el-text type="info" size="default"
                          >板材上料到预切割工作台</el-text
                        >
                      </el-space>
                    </template>
                  </el-result>
                </div>
              </div>
              <div class="space-height-50"></div>
              <div class="container-space-between">
                <div id="itemEnd" ref="itemEndRef">
                  <el-result class="taskresult" :class="classEnd(task)">
                    <template #icon>
                      <el-icon :size="40">
                        <Finished />
                      </el-icon>
                    </template>
                    <template #title>
                      <el-text>完成</el-text>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text></el-text>
                        <el-text type="info" size="default"
                          >任务执行完毕</el-text
                        >
                      </el-space>
                    </template>
                  </el-result>
                </div>
                <div id="itemPartIn" ref="itemPartInRef">
                  <el-result class="taskresult" :class="classProductIn(task)">
                    <template #icon>
                      <el-button
                        v-if="
                          task.WorkFlow?.IsProductInOk === EOpStatus.Running
                        "
                        class="loading"
                        :loading="true"
                      ></el-button>
                      <el-icon v-else :size="40">
                        <Coin />
                      </el-icon>
                    </template>
                    <template #title>
                      <div>
                        <el-button
                          v-if="canProductIn(task)"
                          type="primary"
                          @click="handleProductIn"
                          v-loading="loading"
                          plain
                          >成品入库</el-button
                        >
                        <el-text v-else>成品入库</el-text>
                      </div>
                      <div style="height: 5px"></div>
                      <div>
                        <el-button
                          v-if="canProductOut(task)"
                          type="primary"
                          @click="handleProductOut"
                          v-loading="loading"
                          plain
                          >成品出库</el-button
                        >
                        <el-text v-else>成品出库</el-text>
                      </div>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text>{{ task.ProductInCell?.num }}</el-text>
                        <el-text type="info" size="default"
                          >切割完成后成品入库</el-text
                        >
                      </el-space>
                    </template>
                  </el-result>
                </div>
                <div id="itemMaterialBlank" ref="itemMaterialBlankRef">
                  <el-result
                    class="taskresult"
                    :class="classMaterialBlank(task)"
                  >
                    <template #icon>
                      <el-button
                        v-if="task.WorkFlow?.IsBlankOk === EOpStatus.Running"
                        class="loading"
                        :loading="true"
                      ></el-button>
                      <el-icon v-else :size="40">
                        <DArrowLeft />
                      </el-icon>
                    </template>
                    <template #title>
                      <div>
                        <el-button
                          v-if="canMaterialBlank(task)"
                          type="primary"
                          @click="handleMaterialBlank"
                          v-loading="loading"
                          plain
                          >下料</el-button
                        >
                        <el-text v-else>下料</el-text>
                      </div>
                      <div style="height: 5px"></div>
                      <div>
                        <el-button
                          v-if="canMaterialBlank(task)"
                          type="primary"
                          @click="handleMaterialBlankReset"
                          v-loading="loading"
                          plain
                          >下料复位</el-button
                        >
                        <el-text v-else>下料复位</el-text>
                      </div>
                    </template>
                    <template #sub-title>
                      <el-space direction="vertical" alignment="center">
                        <el-text type="info">切割完成后下料</el-text>
                      </el-space>
                    </template>
                  </el-result>
                </div>
                <div></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <TaskActiveDlg
        :visible="isActiveDlgVisible"
        :taskLine="task.TaskLine"
        @dialogCallback="activeDlgCallback"
      ></TaskActiveDlg>
      <TaskSendFileDlg
        :visible="isSendFileDlgVisible"
        :taskCutList="task.TaskCurrent"
        @dialogCallback="sendFileDlgCallback"
      ></TaskSendFileDlg>
      <SetMaterialcellDlg
        :visible="isSetMaterialcellDlgVisible"
        :param="task"
        @dialogCallback="setMaterialcellDlgCallback"
      >
      </SetMaterialcellDlg>
    </el-main>
    <el-footer class="footer-container">
      <div>
        <el-text type="danger">{{ errorMsg }}</el-text>
      </div>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
//import LeaderLine from "leader-line";

//import LeaderLine from "leader-line";
import LeaderLine from "@/api/leaderline";
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  onBeforeUnmount,
} from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { apiGetDisplayCycleTime } from "@/api/datadic";
import {
  TaskCut,
  ETaskListStatus,
  ETaskItemIndex,
  EWorkTableStatus,
  EOpStatus,
  apiGetCurrentTask,
  apiStartCycle,
  apiSwitchAutoMode,
  apiPauseCycle,
  apiResetCycle,
  apiStopCycle,
  apiMaterialOut,
  apiMaterialIn,
  apiMarking,
  apiMaterialFeed,
  apiMaterialFeedReset,
  apiMaterialBlank,
  apiWorkTableExchange,
  apiWorkTableLock,
  apiCancelActiveCycle,
  apiCutting,
  TaskListStatusStr,
  TaskListStatusType,
  canAutoMode,
  canActivate,
  canCancelActivate,
  canStart,
  classStart,
  canPause,
  canReset,
  canStop,
  canSendFile,
  classSendFile,
  canMaterialOut,
  canMaterialIn,
  classMaterialOut,
  canMarking,
  classMarking,
  classEnd,
  canCutting,
  classCutting,
  canWorkTableExchange,
  classWorkTableExchange,
  canWorkTableLock,
  canWorkTableUnLock,
  canMaterialFeed,
  classMaterialFeed,
  canMaterialBlank,
  classMaterialBlank,
  canProductIn,
  canProductOut,
  classProductIn,
  apiMaterialOutDone,
  apiMarkDone,
  apiMaterialFeedDone,
  apiWorkTableExchangeDone,
  apiMaterialBlankDone,
  apiCutDone,
  TaskGroup,
  apiProductIn,
  apiProductOut,
  TaskStatusStr,
  TaskStatusType,
  apiMaterialBlankReset,
} from "@/api/task";
import { dateTimeFormat } from "@/api/format";
import { DialogResult } from "@/api/interface";
import TaskActiveDlg from "./taskactivedlg.vue";
import TaskSendFileDlg from "./sendfiledlg.vue";
import SetMaterialcellDlg from "./setmaterialcelldlg.vue";
import moment from "moment";
export default defineComponent({
  name: "TaskCurrent",
  components: { TaskActiveDlg, TaskSendFileDlg, SetMaterialcellDlg },
  setup() {
    const store = useStore();
    const isActiveDlgVisible = ref(false);
    const isSendFileDlgVisible = ref(false);
    const isSetMaterialcellDlgVisible = ref(false);
    const loading = ref(false);
    const route = useRoute();
    const workTableFrontClass = ref("");
    const workTableBehindClass = ref("");
    const task = ref<TaskGroup>({
      TaskLine: 0,
    });

    //const itemClass = ref<string[]>(new Array(9).fill(ETaskItemClass.Disable));

    const lines = ref<(any | null)[]>(new Array(10).fill(null));
    const itemStartRef = ref(null);
    const itemSendFileRef = ref(null);
    const itemMaterialOutRef = ref(null);
    const itemMarkRef = ref(null);
    const itemMaterialFeedRef = ref(null);
    const itemWorkTableRef = ref(null);
    const itemCutRef = ref(null);
    const itemMaterialBlankRef = ref(null);
    const itemPartInRef = ref(null);
    const itemEndRef = ref(null);

    const lineinit = ref(false);
    onMounted(() => {
      if (route.params.value !== undefined) {
        const val = Array.isArray(route.params.value)
          ? route.params.value[0]
          : route.params.value;
        task.value.TaskLine = parseInt(val);
      }
      getCycleTime();

      drawLine();
    });

    const timer = ref(0);
    const cycleTime = ref(5);

    const errorMsg = ref("");

    onUnmounted(() => {
      lines.value.forEach((line, index) => {
        if (lines.value[index] !== null) lines.value[index].remove();
        lines.value[index] = null;
      });
    });
    onBeforeUnmount(() => {
      clearInterval(timer.value);
    });

    const getCycleTime = () => {
      apiGetDisplayCycleTime()
        .then((response) => {
          cycleTime.value = response.Data.Task;
          timer.value = setInterval(refreshData, 1000 * cycleTime.value);
          refreshData();
        })
        .catch((error) => {
          ElMessage.error(error.Msg);
          timer.value = setInterval(refreshData, 1000 * cycleTime.value);
        });
    };

    const drawLine = () => {
      console.log("drawLine");
      //const itemStart = document.getElementById("itemStart"); //启动
      //const itemSendFile = document.getElementById("itemSendFile"); //下发切割文件
      //const itemMaterialOut = document.getElementById("itemMaterialOut"); //料库出库
      //const itemMark = document.getElementById("itemMark"); //打码
      //const itemMaterialFeed = document.getElementById("itemMaterialFeed"); //上料
      //const itemWorkTable = document.getElementById("itemWorkTable");
      //const itemCut = document.getElementById("itemCut"); //切割
      //const itemMaterialBlank = document.getElementById("itemMaterialBlank"); //下料
      //const itemPartIn = document.getElementById("itemPartIn"); //原料入库
      //const itemEnd = document.getElementById("itemEnd"); //完成

      // if (itemStartRef.value && itemSendFileRef.value) {
      //   lines.value[0] = new LeaderLine(
      //     itemStartRef.value,
      //     itemSendFileRef.value,
      //     {
      //       color: "#909399",
      //     }
      //   );
      // } else {
      //   console.log("itemStart or itemSendFile is null");
      // }

      if (itemStartRef.value && itemSendFileRef.value) {
        lines.value[0] = new LeaderLine(
          itemStartRef.value,
          itemSendFileRef.value,
          {
            color: "#909399",
          }
        );
      } else {
        console.log("itemStart or itemSendFile is null");
      }

      if (itemSendFileRef.value && itemMaterialOutRef.value) {
        lines.value[1] = new LeaderLine(
          itemSendFileRef.value,
          itemMaterialOutRef.value,
          {
            color: "#909399",
          }
        );
      } else {
        console.log("itemSendFile or itemMaterialOut is null");
      }

      if (itemMaterialOutRef.value && itemMarkRef.value) {
        lines.value[2] = new LeaderLine(
          itemMaterialOutRef.value,
          itemMarkRef.value,
          {
            //startSocket: "bottom",
            //endSocket: "left",
            path: "straight",
            color: "#909399",
          }
        );
      } else {
        console.log("itemMaterialOut or itemMark is null");
      }

      if (itemMarkRef.value && itemMaterialFeedRef.value) {
        lines.value[3] = new LeaderLine(
          itemMarkRef.value,
          LeaderLine.pointAnchor(itemMaterialFeedRef.value, { x: "70%", y: 0 }),
          {
            color: "#909399",
            startSocket: "bottom",
            endSocket: "top",
            path: "straight",
          }
        );
      } else {
        console.log("itemMark or itemMaterialFeed is null");
      }

      if (itemMaterialFeedRef.value && itemWorkTableRef.value) {
        lines.value[4] = new LeaderLine(
          itemMaterialFeedRef.value,
          itemWorkTableRef.value,
          {
            color: "#909399",
          }
        );
      } else {
        console.log("itemMaterialFeed or itemWorkTable is null");
      }

      if (itemWorkTableRef.value && itemCutRef.value) {
        lines.value[5] = new LeaderLine(
          itemWorkTableRef.value,
          itemCutRef.value,
          {
            startSocket: "left",
            endSocket: "right",
            path: "straight",
            color: "#909399",
            startPlug: "arrow1",
            endPlug: "arrow1",
            //dropShadow: true,
            //dropShadow: { color: "blue", dx: 0, dy: 0 },
          }
        );
      } else {
        console.log("itemWorkTable or itemCut is null");
      }

      if (itemWorkTableRef.value && itemMaterialBlankRef.value) {
        lines.value[6] = new LeaderLine(
          itemWorkTableRef.value,
          LeaderLine.pointAnchor(itemMaterialBlankRef.value, {
            x: "100%",
            y: "40%",
          }),
          {
            startSocket: "right",
            endSocket: "right",
            path: "arc",
            color: "#909399",
          }
        );
      } else {
        console.log("itemWorkTable or itemMaterialBlank is null");
      }

      if (itemMaterialBlankRef.value && itemPartInRef.value) {
        lines.value[7] = new LeaderLine(
          itemMaterialBlankRef.value,
          itemPartInRef.value,
          {
            color: "#909399",
          }
        );
      } else {
        console.log("itemMaterialBlank or itemPartIn is null");
      }

      if (itemMaterialBlankRef.value && itemMaterialFeedRef.value) {
        lines.value[8] = new LeaderLine(
          LeaderLine.pointAnchor(itemMaterialBlankRef.value, {
            x: "100%",
            y: "50%",
          }),
          itemMaterialFeedRef.value,
          {
            startSocket: "right",
            endSocket: "bottom",
            path: "straight",
            color: "#909399",
            dash: true,
          }
        );
      } else {
        console.log("itemMaterialBlank or itemMaterialFeed is null");
      }

      if (itemPartInRef.value && itemEndRef.value) {
        lines.value[9] = new LeaderLine(itemPartInRef.value, itemEndRef.value, {
          color: "#909399",
        });
      } else {
        console.log("itemPartIn or itemEnd is null");
      }
    };

    const autoModeStr = () => {
      var msg = "";
      if (task.value.WorkFlow?.IsAutoMode) msg = "【自动模式】";
      else msg = "【手动模式】";
      return msg;
    };

    const activeDlgCallback = (param: DialogResult) => {
      isActiveDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refreshData();
    };

    const sendFileDlgCallback = (param: DialogResult) => {
      isSendFileDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refreshData();
    };

    const setMaterialcellDlgCallback = (param: DialogResult) => {
      isSetMaterialcellDlgVisible.value = param.show ?? false;
      if (param.refresh === true) {
        isActiveDlgVisible.value = true;
      }
    };

    const refreshData = () => {
      apiGetCurrentTask({
        Data: { TaskLine: task.value.TaskLine },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          task.value = response.Data?.Data;
          //console.log(task.value);
          setWorkTable();
          errorMsg.value = "";
        })
        .catch((error) => {
          task.value.TaskCurrent = null;
          task.value.WorkFlow = null;
          errorMsg.value =
            "【" + moment().format("YYYY-MM-DD HH:mm:ss") + "】" + error.Msg;
        });
    };

    const handleRefresh = () => {
      refreshData();
    };
    //激活任务
    const handleActive = () => {
      if (canActivate(task.value) === false) {
        ElMessage.warning("当前任务不能做【激活】操作");
        return;
      }
      if (task.value.WorkFlow !== undefined && task.value.WorkFlow !== null) {
        // 使用可选链和逻辑或为属性提供默认值
        const frontWorkTable = task.value.WorkFlow?.FrontWorkTable || 0;
        const behindWorkTable = task.value.WorkFlow?.BehindWorkTable || 0;

        if (frontWorkTable > 0 || behindWorkTable > 0) {
          ElMessage.warning("切割机交换工作台上还有板材，请注意先清空板材");
        }
      }

      isSetMaterialcellDlgVisible.value = true;
      // isActiveDlgVisible.value = true;
    };
    const handleCancelActive = () => {
      if (canCancelActivate(task.value) === false) {
        ElMessage.warning("当前任务不能做【取消激活】操作");
        return;
      }
      ElMessageBox.confirm("即将取消激活任务，是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiCancelActiveCycle({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;

              ElMessage.success("【取消激活】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    //启动任务
    const handleStart = () => {
      if (canStart(task.value) === false) {
        ElMessage.warning("当前任务不能做【启动】操作");
        return;
      }

      ElMessageBox.confirm("即将启动任务，是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiStartCycle({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;

              ElMessage.success("【启动】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    //切换手自动模式
    const handleAutoMode = () => {
      if (canAutoMode(task.value) === false) {
        ElMessage.warning("当前任务不能做切换【手/自动模式】操作");
        return;
      }

      ElMessageBox.confirm("即将切换【手/自动模式】，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiSwitchAutoMode({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("切换【手/自动模式】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    //发送切割文件
    const handleSendFile = () => {
      if (canSendFile(task.value) === false) {
        ElMessage.warning("当前任务不能【下发切割文件】操作");
        return;
      }

      isSendFileDlgVisible.value = true;
    };
    //暂停
    const handlePause = () => {
      if (canPause(task.value) === false) {
        ElMessage.warning("当前任务不能做【暂停】操作");
        return;
      }
      ElMessageBox.confirm("即将发送【暂停】命令，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiPauseCycle({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;

              ElMessage.success("【暂停】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    //复位
    const handleReset = () => {
      if (canReset(task.value) === false) {
        ElMessage.warning("当前任务不能做【复位】操作");
        return;
      }

      ElMessageBox.confirm("即将发送【复位】命令，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiResetCycle({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【复位】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    //停止
    const handleStop = () => {
      if (canStop(task.value) === false) {
        ElMessage.warning("当前任务不能做【停止】操作");
        return;
      }

      ElMessageBox.confirm("即将发送【停止】命令，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiStopCycle({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【停止】 命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    //原料入库存
    const handleMaterialIn = () => {
      if (canMaterialIn(task.value) === false) {
        ElMessage.warning("当前任务不能做【原料入库】操作");
        return;
      }

      ElMessageBox.confirm("即将发送【原料入库】命令，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiMaterialIn({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【原料入库】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          loading.value = false;
          return;
        });
    };
    const handleMaterialOut = () => {
      if (canMaterialOut(task.value) === false) {
        ElMessage.warning("当前任务不能做【原料出库】操作");
        return;
      }

      ElMessageBox.confirm("即将发送【原料出库】命令，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiMaterialOut({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【原料出库】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    const handleMarking = () => {
      if (canMaterialOut(task.value) === false) {
        ElMessage.warning("当前任务不能做【打码】操作");
        return;
      }

      ElMessageBox.confirm("即将发送【打码】命令，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiMarking({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【打码】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleMaterialFeed = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【上料】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiMaterialFeed({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【上料】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleMaterialFeedReset = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【上料复位】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiMaterialFeedReset({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【上料复位】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleWorkTableExchange = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【交换工作台】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiWorkTableExchange({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【交换工作台】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleWorkTableLock = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【锁定工作台】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiWorkTableLock({
            Data: { TaskLine: task.value.TaskLine, IsLock: true },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【锁定工作台】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleWorkTableUnLock = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【解锁工作台】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiWorkTableLock({
            Data: { TaskLine: task.value.TaskLine, IsLock: false },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【解锁工作台】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleCutting = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【切割】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiCutting({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【切割】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleMaterialBlank = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【下料】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiMaterialBlank({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【下料】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    const handleMaterialBlankReset = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【下料复位】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiMaterialBlankReset({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【下料复位】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    const setWorkTable = () => {
      if (task.value.WorkFlow === undefined) return;
      if (task.value.WorkFlow === null) return;
      if (task.value.WorkFlow.FrontWorkTable === EWorkTableStatus.Idle)
        workTableFrontClass.value = "worktable_idle";
      else if (task.value.WorkFlow.FrontWorkTable === EWorkTableStatus.UnDone)
        workTableFrontClass.value = "worktable_undone";
      else if (task.value.WorkFlow.FrontWorkTable === EWorkTableStatus.Done)
        workTableFrontClass.value = "worktable_done";
      else workTableFrontClass.value = "";

      if (task.value.WorkFlow.BehindWorkTable === EWorkTableStatus.Idle)
        workTableBehindClass.value = "worktable_idle";
      else if (task.value.WorkFlow.BehindWorkTable === EWorkTableStatus.UnDone)
        workTableBehindClass.value = "worktable_undone";
      else if (task.value.WorkFlow.BehindWorkTable === EWorkTableStatus.Done)
        workTableBehindClass.value = "worktable_done";
      else workTableBehindClass.value = "";
    };
    const handleProductIn = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【成品入库】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiProductIn({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【成品入库】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleProductOut = () => {
      ElMessageBox.confirm(
        autoModeStr() + "，即将发送【成品出库】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiProductOut({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【成品出库】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const tableRowClassName = ({
      row,
      rowIndex,
    }: {
      row: TaskCut;
      rowIndex: number;
    }) => {
      if (row.ID === task.value.TaskCurrent?.CurrentTaskCutID) {
        return "warning-text";
      }

      return "";
    };

    const handleMaterialOutDone = () => {
      ElMessageBox.confirm("即将发送【出库完成】命令，是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiMaterialOutDone({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【出库完成】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleMarkDone = () => {
      ElMessageBox.confirm("即将发送【打码完成】命令，是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiMarkDone({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【打码完成】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleMaterialFeedDone = () => {
      ElMessageBox.confirm("即将发送【上料完成】命令，是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiMaterialFeedDone({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【上料完成】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleWorkTableExchangeDone = () => {
      ElMessageBox.confirm(
        "即将发送【交换工作台完成】命令，是否继续?",
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          loading.value = true;
          apiWorkTableExchangeDone({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【交换工作台完成】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleMaterialBlankDone = () => {
      ElMessageBox.confirm("即将发送【下料完成】命令，是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiMaterialBlankDone({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【下料完成】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleCutDone = () => {
      ElMessageBox.confirm("即将发送【切割完成】命令，是否继续?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          loading.value = true;
          apiCutDone({
            Data: { TaskLine: task.value.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.success("【切割完成】命令发送成功");
              refreshData();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              loading.value = false;
            });
        })
        .catch(() => {
          return;
        });
    };
    return {
      itemStartRef,
      itemSendFileRef,
      itemMaterialOutRef,
      itemMarkRef,
      itemMaterialFeedRef,
      itemWorkTableRef,
      itemCutRef,
      itemMaterialBlankRef,
      itemPartInRef,
      itemEndRef,
      loading,
      isActiveDlgVisible,
      isSendFileDlgVisible,
      setMaterialcellDlgCallback,
      ETaskListStatus,
      task,
      ETaskItemIndex,
      workTableFrontClass,
      workTableBehindClass,
      EOpStatus,
      errorMsg,
      canAutoMode,
      canActivate,
      canCancelActivate,
      canStart,
      classStart,
      canPause,
      canReset,
      canStop,
      canSendFile,
      classSendFile,
      canMaterialIn,
      canMaterialOut,
      classMaterialOut,
      canMarking,
      classMarking,
      classEnd,
      canCutting,
      classCutting,
      canWorkTableExchange,
      classWorkTableExchange,
      canWorkTableLock,
      canWorkTableUnLock,
      canMaterialFeed,
      canProductIn,
      canProductOut,
      classProductIn,
      classMaterialFeed,
      canMaterialBlank,
      classMaterialBlank,
      activeDlgCallback,
      sendFileDlgCallback,
      isSetMaterialcellDlgVisible,
      dateTimeFormat,
      handleActive,
      handleCancelActive,
      handleRefresh,
      handleStart,
      handleAutoMode,
      handleSendFile,
      handlePause,
      handleReset,
      handleStop,
      handleMaterialIn,
      handleMaterialOut,
      handleMarking,
      handleMaterialFeed,
      handleMaterialBlank,
      handleWorkTableExchange,
      handleWorkTableLock,
      handleCutting,
      tableRowClassName,
      handleWorkTableUnLock,
      TaskListStatusStr,
      TaskListStatusType,
      handleMaterialOutDone,
      handleMarkDone,
      handleMaterialFeedDone,
      handleWorkTableExchangeDone,
      handleMaterialBlankDone,
      handleCutDone,
      handleProductIn,
      handleProductOut,
      TaskStatusStr,
      TaskStatusType,
      handleMaterialFeedReset,
      handleMaterialBlankReset,
    };
  },
});
</script>
<style scoped lang="scss"></style>
