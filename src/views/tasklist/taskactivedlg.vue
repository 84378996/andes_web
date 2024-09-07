<template>
  <el-dialog
    v-model="innerVisible"
    title="任务列表信息"
    :width="1200"
    :before-close="dlgClose"
    center
    destroy-on-close
  >
    <el-table
      ref="table"
      class="el-table-with-tool"
      v-loading="loading"
      :data="taskList"
      stripe
      highlight-current-row
    >
      <el-table-column
        label="#"
        width="70px"
        align="center"
        show-overflow-tooltip
      >
        <template v-slot="scope">
          <el-text> {{ scope.$index + 1 }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90px" align="center">
        <template v-slot="scope">
          <el-button
            class="el-table-button"
            type="primary"
            plain
            @click="handleActive(scope.row)"
          >
            <el-icon>
              <DocumentChecked />
            </el-icon>
            激活
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态" min-width="100px" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text :type="TaskListStatusType(scope.row.Status)">{{
            TaskListStatusStr(scope.row.Status)
          }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="任务编号" min-width="120x" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.TaskNo }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="文件数" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.TaskCutCount }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="上料" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.FeedCount }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="切割" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.FinishCount }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="总数" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.TotalCount }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="添加时间" min-width="120x" show-overflow-tooltip>
        <template v-slot="scope"
          ><el-text> {{ dateTimeFormat(scope.row.AddTime) }}</el-text>
        </template>
      </el-table-column>
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dlgClose"> 取 消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  TaskListCondition,
  apiGetTasks,
  TaskCutList,
  ETaskListStatus,
  TaskListStatusType,
  TaskListStatusStr,
  apiActiveCycle,
} from "@/api/task";
import { DialogResult } from "@/api/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateTimeFormat } from "@/api/format";
export default defineComponent({
  name: "TaskActiveDlg",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    taskLine: {
      type: Number,
      default: 0,
    },
  },
  emits: {
    dialogCallback: (val: DialogResult) => true,
  },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const innerVisible = ref(false);
    const taskList = ref<TaskCutList[]>([]);

    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        taskList.value = [];
        if (innerVisible.value === true) {
          refreshList();
        }
      }
    );

    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };

    const refreshList = () => {
      loading.value = true;
      const param: TaskListCondition = {
        TaskLine: props.taskLine,
        Status: 0,
        PageIndex: 1,
        PageSize: 1000,
      };
      apiGetTasks({
        Data: param,
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          taskList.value = response.Data?.Data;
          loading.value = false;
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };
    const handleActive = (row: any) => {
      ElMessageBox.confirm("即将激活任务" + row.TaskNo + "是否继续?", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          activeTask(row.ID);
        })
        .catch(() => {
          // 取消;
        });
    };

    const activeTask = (taskid: number) => {
      loading.value = true;

      apiActiveCycle({
        Data: { ID: taskid, TaskLine: props.taskLine },
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          let param: DialogResult = { show: false, refresh: true };
          emit("dialogCallback", param);
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    return {
      loading,
      innerVisible,
      taskList,
      ETaskListStatus,

      dlgClose,
      dateTimeFormat,
      TaskListStatusType,
      TaskListStatusStr,
      handleActive,
    };
  },
});
</script>
<style lang="scss" scoped></style>
