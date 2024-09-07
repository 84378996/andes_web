<template>
  <el-container class="app-container">
    <el-main class="main-container">
      <div class="space-height-10"></div>
      <el-space wrap>
        <div
          class="tasklist"
          v-for="item in tasks"
          :key="item.TaskLine"
          v-show="item.WorkFlow?.Enable === true"
        >
          <el-descriptions :column="2" border class="descriptions-task">
            <el-descriptions-item label="任务列表" :span="2">
              <div class="container-space-between">
                <el-text>{{ item.TaskLineName }}</el-text>
                <el-button type="primary" @click="handleTask(item)" plain
                  >打开</el-button
                >
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="任务号" :span="2">
              {{ item.TaskCurrent?.TaskNo }}
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-text :type="TaskListStatusType(item.TaskCurrent?.Status)">{{
                TaskListStatusStr(item.TaskCurrent?.Status)
              }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="模式">
              <div v-if="item.WorkFlow">
                <el-text v-if="item.WorkFlow?.IsAutoMode">自动模式</el-text>
                <el-text v-else>手动模式</el-text>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="文件数">
              {{ item.TaskCurrent?.TaskCutCount }}
            </el-descriptions-item>
            <el-descriptions-item label="钢板数">
              {{ item.TaskCurrent?.TaskCutCount }}
            </el-descriptions-item>
            <el-descriptions-item label="上料">
              {{ item.TaskCurrent?.FeedCount }}
            </el-descriptions-item>
            <el-descriptions-item label="切割">
              {{ item.TaskCurrent?.FinishCount }}
            </el-descriptions-item>
            <el-descriptions-item label="缓冲区" :span="2">
              <el-text
                >{{ item.MaterialOutCell?.material + " " }},({{
                  item.MaterialOutCell?.length
                }}*{{ item.MaterialOutCell?.width }}*{{
                  item.MaterialOutCell?.thickness
                }}),{{ " " + item.MaterialOutCell?.num + " " }},
                {{ item.IsMaterialOutDone == true ? "托盘存在" : "托盘不存在" }}
              </el-text>
            </el-descriptions-item>
          </el-descriptions>
          <el-space wrap>
            <el-button
              type="primary"
              :disabled="!canAutoMode(item)"
              @click="handleAutoMode(item)"
              v-loading="item.loading"
              plain
            >
              手动/自动模式</el-button
            >

            <el-button
              type="primary"
              :disabled="!canActivate(item)"
              @click="handleActive(item)"
              v-loading="item.loading"
              plain
              >激活</el-button
            >

            <el-button
              type="primary"
              :disabled="!canCancelActivate(item)"
              @click="handleCancelActive(item)"
              v-loading="item.loading"
              plain
              >取消激活</el-button
            >
            <el-button
              type="primary"
              :disabled="!canStart(item)"
              @click="handleStart(item)"
              v-loading="item.loading"
              plain
              >启动</el-button
            >

            <el-button
              type="primary"
              :disabled="!canPause(item)"
              @click="handlePause(item)"
              v-loading="item.loading"
              plain
              >暂停</el-button
            >
            <el-button
              type="primary"
              :disabled="!canReset(item)"
              @click="handleReset(item)"
              v-loading="item.loading"
              plain
              >复位</el-button
            >
            <el-button
              type="primary"
              :disabled="!canStop(item)"
              @click="handleStop(item)"
              v-loading="item.loading"
              plain
              >停止</el-button
            >
          </el-space>
          <el-table
            border
            :data="item.TaskCurrent?.TaskCuts"
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
      </el-space>
      <TaskActiveDlg
        :visible="isActiveDlgVisible"
        :taskLine="taskGroup.TaskLine"
        @dialogCallback="activeDlgCallback"
      ></TaskActiveDlg>
      <SetMaterialcellDlg
        :visible="isSetMaterialcellDlgVisible"
        :param="taskGroup"
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
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import moment from "moment";
import {
  TaskCut,
  TaskGroup,
  ETaskListStatus,
  TaskListStatusStr,
  TaskListStatusType,
  apiStartCycle,
  apiSwitchAutoMode,
  apiPauseCycle,
  apiResetCycle,
  apiStopCycle,
  canAutoMode,
  canActivate,
  canCancelActivate,
  canStart,
  canPause,
  canReset,
  apiGetCurrentTask,
  apiCancelActiveCycle,
  canStop,
} from "@/api/task";
import { apiGetDisplayCycleTime } from "@/api/datadic";
import TaskActiveDlg from "./taskactivedlg.vue";
import { DialogResult } from "@/api/interface";
import SetMaterialcellDlg from "./setmaterialcelldlg.vue";
export default defineComponent({
  name: "TasksCurrent",
  components: { TaskActiveDlg, SetMaterialcellDlg },
  props: {
    msg: String,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const isActiveDlgVisible = ref(false);
    const isSetMaterialcellDlgVisible = ref(false);
    //const taskLine = ref(0);
    const taskGroup = ref<TaskGroup>({
      TaskLine: 0,
      TaskLineName: "",
    });
    //const tasks = ref<TaskGroup[]>([]);
    const tasks = ref<TaskGroup[]>([
      {
        TaskLine: 0,
        loading: false,
        TaskLineName: "",
      },
      {
        TaskLine: 0,
        loading: false,
        TaskLineName: "",
      },
      {
        TaskLine: 0,
        loading: false,
        TaskLineName: "",
      },
      {
        TaskLine: 0,
        loading: false,
        TaskLineName: "",
      },
    ]);
    const timer = ref(0);
    const errorMsg = ref("");
    const cycleTime = ref(5);

    onMounted(() => {
      getCycleTime();
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

    const refreshData = () => {
      apiGetCurrentTask({
        Data: {},
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          tasks.value = response.Data?.Data;

          //setWorkTable();

          //parseStatus();
          errorMsg.value = "";
        })
        .catch((error) => {
          tasks.value = [];
          errorMsg.value =
            "【" + moment().format("YYYY-MM-DD HH:mm:ss") + "】" + error.Msg;
        });
    };

    const handleTask = (task: TaskGroup | undefined | null) => {
      if (task === undefined) return;
      if (task === null) return;
      if (task.TaskLine === 0) return;
      if (task.TaskLineName === undefined) return;
      if (task.TaskLineName === null) return;
      router.push({
        name: "TaskCurrent",
        params: {
          value: task.TaskLine,
          label: task.TaskLineName,
        },
      });
    };

    //切换手自动模式
    const handleAutoMode = (item: TaskGroup) => {
      if (canAutoMode(item) === false) {
        ElMessage.warning(
          "任务 " + item.TaskLineName + " 不能做切换【手/自动模式】操作"
        );
        return;
      }

      ElMessageBox.confirm(
        item.TaskLineName + " 即将切换【手/自动模式】，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          item.loading = true;
          apiSwitchAutoMode({
            Data: { TaskLine: item.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              item.loading = false;
              ElMessage.success("切换【手/自动模式】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              item.loading = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    //激活任务
    const handleActive = (item: TaskGroup) => {
      if (canActivate(item) === false) {
        ElMessage.warning(item.TaskLineName + " 不能做【激活】操作");
        return;
      }

      if (item.WorkFlow !== undefined && item.WorkFlow !== null) {
        // 使用可选链和逻辑或为属性提供默认值
        const frontWorkTable = item.WorkFlow?.FrontWorkTable || 0;
        const behindWorkTable = item.WorkFlow?.BehindWorkTable || 0;

        if (frontWorkTable > 0 || behindWorkTable > 0) {
          ElMessage.warning("切割机交换工作台上还有板材，请注意先清空板材");
        }
      }

      taskGroup.value = item;
      //isActiveDlgVisible.value = true;
      isSetMaterialcellDlgVisible.value = true;
    };

    const handleCancelActive = (item: TaskGroup) => {
      if (canCancelActivate(item) === false) {
        ElMessage.warning(item.TaskLineName + " 不能做【取消激活】操作");
        return;
      }
      ElMessageBox.confirm("即将取消激活任务，是否继续?", "提示", {
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        type: "warning",
      })
        .then(() => {
          item.loading = true;
          apiCancelActiveCycle({
            Data: { TaskLine: item.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              item.loading = false;

              ElMessage.success("【取消激活】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              item.loading = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    //启动任务
    const handleStart = (item: TaskGroup) => {
      if (canStart(item) === false) {
        ElMessage.warning(item.TaskLineName + " 不能做【启动】操作");
        return;
      }

      ElMessageBox.confirm(
        item.TaskLineName + ",即将【启动】任务，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          item.loading = true;
          apiStartCycle({
            Data: { TaskLine: item.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              item.loading = false;
              ElMessage.success(item.TaskLineName + "【启动】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              item.loading = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    //暂停
    const handlePause = (item: TaskGroup) => {
      if (canPause(item) === false) {
        ElMessage.warning(item.TaskLineName + "不能做【暂停】操作");
        return;
      }
      ElMessageBox.confirm(
        item.TaskLineName + ",即将发送【暂停】命令，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          item.loading = true;
          apiPauseCycle({
            Data: { TaskLine: item.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              item.loading = false;

              ElMessage.success("【暂停】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              item.loading = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    //复位
    const handleReset = (item: TaskGroup) => {
      if (canReset(item) === false) {
        ElMessage.warning("当前任务不能做【复位】操作");
        return;
      }

      ElMessageBox.confirm(
        item.TaskLineName + ",即将【复位】，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          item.loading = true;
          apiResetCycle({
            Data: { TaskLine: item.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              item.loading = false;
              ElMessage.success("【复位】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              item.loading = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    //停止
    const handleStop = (item: TaskGroup) => {
      if (canStop(item) === false) {
        ElMessage.warning("当前任务不能做【停止】操作");
        return;
      }

      ElMessageBox.confirm(
        item.TaskLineName + ",即将【停止】任务，是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          item.loading = true;
          apiStopCycle({
            Data: { TaskLine: item.TaskLine },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              item.loading = false;
              ElMessage.success("【停止】命令发送成功");
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
              item.loading = false;
            });
        })
        .catch(() => {
          return;
        });
    };

    const tableRowClassName =
      (index: number) =>
      ({ row, rowIndex }: { row: TaskCut; rowIndex: number }) => {
        if (row.ID === tasks.value[index].TaskCurrent?.CurrentTaskCutID) {
          return "warning-text";
        }

        return "";
      };

    const activeDlgCallback = (param: DialogResult) => {
      isActiveDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refreshData();
    };
    const setMaterialcellDlgCallback = (param: DialogResult) => {
      isSetMaterialcellDlgVisible.value = param.show ?? false;
      if (param.refresh === true) {
        isActiveDlgVisible.value = true;
      }
    };
    return {
      handleTask,
      tasks,
      errorMsg,
      ETaskListStatus,
      isActiveDlgVisible,
      isSetMaterialcellDlgVisible,
      taskGroup,
      TaskListStatusStr,
      TaskListStatusType,
      handleAutoMode,
      handleActive,
      handleStart,
      handlePause,
      handleReset,
      handleStop,
      tableRowClassName,
      handleCancelActive,
      canAutoMode,
      canActivate,
      canCancelActivate,
      canStart,
      canPause,
      canReset,
      canStop,
      activeDlgCallback,
      setMaterialcellDlgCallback,
    };
  },
});
</script>
