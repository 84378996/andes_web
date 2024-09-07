<template>
  <el-dialog
    v-model="innerVisible"
    :title="title"
    :width="1200"
    :before-close="dlgClose"
    center
    destroy-on-close
  >
    <TaskCutAddDlg
      :visible="isAddTaskCutDlgVisible"
      @dialogCallback="addTaskCutDlgCallback"
      append-to-body
      :param="task"
    />
    <TaskCutEditDlg
      :visible="isEditTaskCutDlgVisible"
      @dialogCallback="editTaskCutDlgCallback"
      append-to-body
      :param="taskcut"
    />

    <div class="container-space-between">
      <el-space wrap>
        <el-button class="blue" icon="Plus" @click="handleAddTaskCut"
          >添加切割文件</el-button
        >
        <!-- <el-button class="green" icon="ArrowUp" @click="handleUp"
          >上移</el-button
        >
        <el-button class="green" icon="ArrowDown" @click="handleDown"
          >下移</el-button
        > -->
        <el-divider direction="vertical" />
        <el-button
          class="orange"
          icon="Edit"
          @click="handleEdit"
          :disabled="multipleSelection.length !== 1"
          >编辑</el-button
        >
        <el-button
          class="orange"
          icon="DeleteFilled"
          @click="handleDelete"
          :disabled="multipleSelection.length === 0"
          >删除</el-button
        >
      </el-space>
      <el-button
        class="green"
        @click="handleRefresh"
        icon="Refresh"
        :loading="loading"
        >刷新</el-button
      >
    </div>
    <div class="space-height-10"></div>
    <el-table
      ref="table"
      class="el-table-with-tool"
      :data="task.TaskCuts"
      stripe
      border
      highlight-current-row
      v-loading="loading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50px" />
      <el-table-column label="顺序" show-overflow-tooltip width="70px">
        <template v-slot="scope">
          {{ scope.row.Sort }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160px" align="center">
        <template v-slot="scope">
          <el-space>
            <el-button
              class="el-table-button"
              type="primary"
              :disabled="scope.row.Sort <= 1"
              plain
              @click="handleUp(scope.row)"
            >
              <el-icon>
                <SortUp />
              </el-icon>
              上移
            </el-button>
            <el-button
              class="el-table-button"
              type="primary"
              :disabled="scope.row.Sort >= (task.TaskCuts?.length || 0)"
              plain
              @click="handleDown(scope.row)"
            >
              <el-icon>
                <SortDown />
              </el-icon>
              下移
            </el-button>
          </el-space>
        </template>
      </el-table-column>
      <el-table-column
        label="文件名"
        prop="TaskName"
        min-width="120x"
        show-overflow-tooltip
      />
      <el-table-column
        label="数量"
        width="70px"
        prop="TotalCount"
        show-overflow-tooltip
      />
      <el-table-column
        label="长(mm)"
        width="90px"
        prop="Length"
        show-overflow-tooltip
      />
      <el-table-column
        label="宽(mm)"
        width="90px"
        prop="Width"
        show-overflow-tooltip
      />
      <el-table-column
        label="板厚(mm)"
        width="100px"
        prop="Thickness"
        show-overflow-tooltip
      />
      <el-table-column label="路径" prop="Path" show-overflow-tooltip />
    </el-table>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dlgClose">关闭</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  apiGetTask,
  TaskCut,
  TaskCutList,
  apiDeleteTaskCut,
  apiMoveTaskCut,
} from "@/api/task";
import { DialogResult } from "@/api/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import TaskCutAddDlg from "./addtaskcutdlg.vue";
import TaskCutEditDlg from "./edittaskcutdlg.vue";
export default defineComponent({
  name: "TaskCutsDlg",
  components: { TaskCutAddDlg, TaskCutEditDlg },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => TaskCutList,
      default: () => {
        return {};
      },
    },
  },
  emits: {
    dialogCallback: (val: DialogResult) => true,
  },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const innerVisible = ref(false);
    const title = ref("编辑任务信息");
    const isAddTaskCutDlgVisible = ref(false);
    const isEditTaskCutDlgVisible = ref(false);
    const multipleSelection = ref<TaskCut[]>([]);
    const task = ref<TaskCutList>({
      ID: 0,
      TaskLine: 0,
      TaskNo: "",
      TaskCuts: [],
    });
    const taskcut = ref<TaskCut>({
      ID: 0,
      TaskName: "",
      Path: "",
      Material: "",
      Length: null,
      Width: null,
      Thickness: null,
      TotalCount: null,
      TaskID: 0,
    });
    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        task.value.ID = props.param.ID;
        if (newValue) getTask();
      }
    );

    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };

    const getTask = () => {
      loading.value = true;
      apiGetTask({
        Data: { ID: props.param.ID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          task.value = response.Data?.Data;
          title.value =
            "编辑任务信息_" + task.value.TaskLineName + "_" + task.value.TaskNo;
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    const handleAddTaskCut = () => {
      isAddTaskCutDlgVisible.value = true;
    };

    const addTaskCutDlgCallback = (param: DialogResult) => {
      isAddTaskCutDlgVisible.value = param.show ?? false;
      getTask();
    };
    const editTaskCutDlgCallback = (param: DialogResult) => {
      isEditTaskCutDlgVisible.value = param.show ?? false;
      getTask();
    };

    const handleEdit = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要编辑的行");
        return;
      }
      taskcut.value = multipleSelection.value[0];
      isEditTaskCutDlgVisible.value = true;
    };

    const handleUp = (row: any) => {
      loading.value = true;
      var param = {
        ID: row.ID,
        Sort: -1,
        TaskID: row.TaskID,
      };
      console.log(param);
      apiMoveTaskCut({
        Data: param,
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          getTask();
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    const handleDown = (row: any) => {
      loading.value = true;
      var param = {
        ID: row.ID,
        Sort: 1,
        TaskID: row.TaskID,
      };
      console.log(param);
      apiMoveTaskCut({
        Data: param,
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          getTask();
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    const handleSelectionChange = (val: any) => {
      multipleSelection.value = val;
    };

    const handleDelete = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要删除的行");
        return;
      }

      var str = "";
      for (var i = 0; i < multipleSelection.value.length; i++) {
        var row = multipleSelection.value[i];
        str = str + "【" + row.TaskName + "】";
      }

      ElMessageBox.confirm("即将删除 " + str + " ,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apiDeleteTaskCut({
            Data: { TaskID: task.value.ID },
            Array: multipleSelection.value,
            OperID: store.getters.user.ID,
          })
            .then(() => {
              ElMessage.success("删除成功");
              getTask();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
            });
        })
        .catch(() => {
          return;
        });
    };
    const handleRefresh = () => {
      getTask();
    };
    return {
      loading,
      innerVisible,
      isAddTaskCutDlgVisible,
      isEditTaskCutDlgVisible,
      title,
      multipleSelection,
      dlgClose,
      handleAddTaskCut,
      addTaskCutDlgCallback,
      editTaskCutDlgCallback,
      task,
      taskcut,
      handleUp,
      handleDown,
      handleSelectionChange,
      handleEdit,
      handleDelete,
      handleRefresh,
    };
  },
});
</script>
<style lang="scss" scoped></style>
