<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
          <el-form-item label="任务" prop="TaskLine">
            <el-select v-model="ruleForm.TaskLine" clearable>
              <el-option
                v-for="item in taskLineOptions"
                :key="item.Key"
                :label="item.Value"
                :value="item.Key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务号" prop="TaskNo">
            <el-input v-model="ruleForm.TaskNo"></el-input>
          </el-form-item>
          <el-form-item label="添加时间">
            <el-date-picker
              v-model="ruleForm.StartTime"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY年MM月DD日"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker
              v-model="ruleForm.EndTime"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY年MM月DD日"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="状态" prop="Status" clearable>
            <el-select v-model="ruleForm.Status">
              <el-option
                :label="TaskListStatusStr(ETaskListStatus.Default)"
                :value="ETaskListStatus.Default"
              />
              <el-option
                :label="TaskListStatusStr(ETaskListStatus.Active)"
                :value="ETaskListStatus.Active"
              />
              <el-option
                :label="TaskListStatusStr(ETaskListStatus.Start)"
                :value="ETaskListStatus.Start"
              />
              <el-option
                :label="TaskListStatusStr(ETaskListStatus.Completed)"
                :value="ETaskListStatus.Completed"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="handleQuery"
              type="primary"
              :loading="loading"
              icon="Search"
            >
              查询</el-button
            ></el-form-item
          >
          <el-form-item>
            <el-button @click="handleQueryClear" icon="RefreshLeft"
              >重置</el-button
            ></el-form-item
          >
        </el-form>
      </div>
      <div class="header-container-tool">
        <el-space wrap>
          <el-button class="green" @click="handleAdd" icon="Plus"
            >添加</el-button
          >
          <el-button
            class="orange"
            icon="Edit"
            @click="handleEdit"
            :disabled="multipleSelection.length !== 1"
            >编辑</el-button
          >
          <el-button
            class="orange"
            icon="Edit"
            @click="handleEditCuts"
            :disabled="multipleSelection.length !== 1"
            >编辑切割文件</el-button
          >

          <el-button
            class="red"
            icon="DeleteFilled"
            @click="handleDelete"
            :disabled="multipleSelection.length === 0"
            >删除</el-button
          >

          <!-- <el-button
               
                class="blue"
                icon="Download"
                @click="handleExport"
                :loading="loading"
                >导出</el-button
              >-->
        </el-space>

        <el-button
          class="green"
          @click="refreshList"
          icon="Refresh"
          :disabled="query.PageIndex === undefined || query.PageIndex === null"
          :loading="loading"
          >刷新</el-button
        >
      </div>
    </el-header>
    <el-main class="main-container container-border">
      <el-table
        ref="table"
        class="el-table-with-tool"
        v-loading="loading"
        :data="taskList"
        stripe
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :width="columnSelectionWidth" />
        <el-table-column
          label="#"
          :width="columnIndexWidth"
          show-overflow-tooltip
        >
          <template v-slot="scope">
            <el-text> {{ getRowIndex(scope.$index, query) }}</el-text>
          </template>
        </el-table-column>

        <el-table-column label="操作" :width="columnOperateWidth">
          <template v-slot="scope">
            <el-button
              class="el-table-button"
              type="primary"
              plain
              @click="menuDetail(scope.row)"
            >
              详细
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="任务" width="110px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.TaskLineName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text :type="TaskListStatusType(scope.row.Status)">{{
              TaskListStatusStr(scope.row.Status)
            }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="任务号" width="180px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.TaskNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="文件数" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.TaskCutCount }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="钢板总数" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.TotalCount }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="上料数量" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.FeedCount }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="完成数量" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.FinishCount }}</el-text>
          </template>
        </el-table-column>

        <el-table-column label="开始时间" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text> {{ dateTimeFormat(scope.row.StartTime) }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ dateTimeFormat(scope.row.EndTime) }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ dateTimeFormat(scope.row.AddTime) }}</el-text>
          </template>
        </el-table-column>
      </el-table>

      <TaskEditDlg
        :visible="isEditDlgVisible"
        :param="dlgParam"
        @dialogCallback="editDialogCallback"
      ></TaskEditDlg>
      <TaskCutsDlg
        :visible="isModifyTaskCutsDlgVisible"
        :param="dlgParam"
        @dialogCallback="editDialogCallback"
      ></TaskCutsDlg>
      <TaskDetailDlg
        :visible="isDetailDlgVisible"
        :param="dlgParam"
        @dialogCallback="detailDialogCallback"
      >
      </TaskDetailDlg>
    </el-main>
    <el-footer class="footer-container">
      <el-scrollbar>
        <el-pagination
          layout="total,sizes,prev, pager, next, jumper"
          :background="false"
          :page-size="ruleForm.PageSize"
          :total="total"
          :page-sizes="[15, 20, 30, 50]"
          @size-change="handleSizeChange"
          :current-page="ruleForm.PageIndex"
          @current-change="handleCurrentChange"
        />
      </el-scrollbar>
      <span></span>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, onMounted } from "vue";
import TaskEditDlg from "./taskeditdlg.vue";
import TaskCutsDlg from "./taskcutsdlg.vue";
import TaskDetailDlg from "./taskdetaildlg.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { useStore } from "vuex";
import { KeyValuePair } from "@/api/interface";
import {
  getColumnWidth,
  getRowIndex,
  columnSelectionWidth,
  columnOperateWidth,
} from "@/api/common";
import {
  TaskCutList,
  apiGetTasks,
  TaskListCondition,
  ETaskListStatus,
  TaskListStatusStr,
  TaskListStatusType,
  apiDeleteTask,
  apiGetTaskLineOptions,
} from "@/api/task";
import { dateTimeFormat } from "@/api/format";
import { DialogResult } from "@/api/interface";
export default defineComponent({
  name: "TaskList",
  components: { TaskCutsDlg, TaskEditDlg, TaskDetailDlg },
  props: {
    msg: String,
    taskLine: {
      //任务分类
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const store = useStore();

    const isDetailDlgVisible = ref(false);
    const isEditDlgVisible = ref(false);
    const isModifyTaskCutsDlgVisible = ref(false);

    const columnIndexWidth = ref(50);

    const dlgParam = ref<TaskCutList>({
      TaskLine: props.taskLine,
    });
    const loading = ref(false);
    const total = ref(0);
    const ruleForm = reactive<TaskListCondition>({
      TaskLine: null,
      TaskNo: null,
      StartTime: null,
      EndTime: null,
      Status: null,
      PageIndex: 1,
      PageSize: 15,
    });
    const query = ref<TaskListCondition>({});

    const taskList = ref<TaskCutList[]>([]);
    const multipleSelection = ref<TaskCutList[]>([]);
    const taskLineOptions = ref<KeyValuePair[]>([]);
    onMounted(() => {
      getTaskLineOptions();
    });

    const editDialogCallback = (param: DialogResult) => {
      isModifyTaskCutsDlgVisible.value = param.show ?? false;
      isEditDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refreshList();
    };

    const detailDialogCallback = (param: DialogResult) => {
      isDetailDlgVisible.value = param.show ?? false;
    };

    const handleQuery = () => {
      ruleForm.PageIndex = 1;
      Object.assign(query.value, ruleForm);
      refreshList();
    };

    const handleQueryClear = () => {
      ruleForm.StartTime = null;
      ruleForm.EndTime = null;
      ruleForm.Status = null;
      ruleForm.TaskLine = null;
      ruleForm.TaskNo = null;
    };

    const refreshList = () => {
      loading.value = true;
      taskList.value = [];
      apiGetTasks({
        Data: query.value,
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          taskList.value = response.Data?.Data;
          loading.value = false;
          //setColumnWidth();
          columnIndexWidth.value = getColumnWidth(query.value);
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    const tableRowClassName = ({
      row,
      index,
    }: {
      row: TaskCutList;
      index: number;
    }) => {
      //注意  不要与stripe 斑马纹混合使用，否则无效
      if (row.Status === 1) {
        return "brand-row";
      } else if (row.Status === 2) {
        return "warning-row";
      } else {
        return "";
      }
    };
    const handleCurrentChange = (val: number) => {
      ruleForm.PageIndex = val;
      Object.assign(query.value, ruleForm);
      refreshList();
    };

    const handleSizeChange = (val: number) => {
      ruleForm.PageSize = val;
      Object.assign(query.value, ruleForm);
      refreshList();
    };

    const handleSelectionChange = (val: any) => {
      multipleSelection.value = val;
    };

    const menuDetail = (row: any) => {
      dlgParam.value = { ID: row.ID };
      isDetailDlgVisible.value = true;
    };
    const handleAdd = () => {
      dlgParam.value = { ID: 0 };
      isEditDlgVisible.value = true;
    };
    const handleEdit = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要编辑的行");
        return;
      }

      if (multipleSelection.value[0].Status !== ETaskListStatus.Default) {
        ElMessage.warning(
          "任务" +
            TaskListStatusStr(multipleSelection.value[0].Status) +
            ",不能修改"
        );
        return;
      }

      dlgParam.value = multipleSelection.value[0];
      isEditDlgVisible.value = true;
    };

    const handleEditCuts = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要编辑的行");
        return;
      }
      if (multipleSelection.value[0].Status !== ETaskListStatus.Default) {
        ElMessage.warning(
          "任务" +
            TaskListStatusStr(multipleSelection.value[0].Status) +
            ",不能修改"
        );
        return;
      }
      dlgParam.value = multipleSelection.value[0];
      isModifyTaskCutsDlgVisible.value = true;
    };
    const handleDelete = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要删除的行");
        return;
      }
      if (multipleSelection.value[0].Status !== ETaskListStatus.Default) {
        ElMessage.warning(
          "任务" +
            TaskListStatusStr(multipleSelection.value[0].Status) +
            ",不能删除"
        );
        return;
      }
      var str = "";
      for (var i = 0; i < multipleSelection.value.length; i++) {
        var row = multipleSelection.value[i];
        str = str + "【" + row.TaskLineName + "," + row.TaskNo + "】";
      }

      ElMessageBox.confirm("即将删除 " + str + " ,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apiDeleteTask({
            Array: multipleSelection.value,
            OperID: store.getters.user.ID,
          })
            .then(() => {
              ElMessage.success("删除成功");
              refreshList();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
            });
        })
        .catch(() => {
          return;
        });
    };

    const getTaskLineOptions = () => {
      apiGetTaskLineOptions({
        Data: {},
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          taskLineOptions.value = response.Data.Data;
        })
        .catch((error) => {
          ElMessage.error(error.Msg);
        });
    };

    return {
      loading,

      isDetailDlgVisible,
      isModifyTaskCutsDlgVisible,
      isEditDlgVisible,
      taskList,
      multipleSelection,
      dlgParam,
      ETaskListStatus,
      ruleForm,
      total,
      query,
      taskLineOptions,
      columnOperateWidth,
      columnSelectionWidth,
      editDialogCallback,
      refreshList,
      dateTimeFormat,
      tableRowClassName,
      handleQuery,
      handleQueryClear,
      handleSizeChange,
      handleCurrentChange,
      handleSelectionChange,
      menuDetail,
      handleAdd,
      handleEdit,
      handleEditCuts,
      TaskListStatusStr,
      TaskListStatusType,
      handleDelete,
      detailDialogCallback,
      columnIndexWidth,
      getRowIndex,
    };
  },
});
</script>
<style scoped lang="scss"></style>
