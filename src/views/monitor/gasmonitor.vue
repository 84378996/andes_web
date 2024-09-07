<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
          <el-form-item label="设备号" prop="TaskNo">
            <el-input v-model="ruleForm.TaskNo"></el-input>
          </el-form-item>
          <el-form-item label="时间">
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
        </el-form>
      </div>
      <div class="header-container-tool">
        <el-space wrap>
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
        :data="devicelist"
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
        <el-table-column label="设备号" width="180px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.no }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="imei" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.imei }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="value" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.value }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="时间" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text> {{ dateTimeFormat(scope.row.lastrecordtime) }}</el-text>
          </template>
        </el-table-column>
      </el-table>
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
import { GasDevice, apiGetDevices } from "@/api/gas";
import { dateTimeFormat } from "@/api/format";
import { DialogResult } from "@/api/interface";
export default defineComponent({
  name: "GasMonitor",
  components: {},
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

    const devicelist = ref<GasDevice[]>([]);
    const multipleSelection = ref<GasDevice[]>([]);
    const taskLineOptions = ref<KeyValuePair[]>([]);
    onMounted(() => {
      //getTaskLineOptions();
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
      devicelist.value = [];
      apiGetDevices({
        Data: query.value,
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          devicelist.value = response.Data?.Data;
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
      devicelist,
      isDetailDlgVisible,
      isModifyTaskCutsDlgVisible,
      isEditDlgVisible,
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
      TaskListStatusStr,
      TaskListStatusType,
      detailDialogCallback,
      columnIndexWidth,
      getRowIndex,
    };
  },
});
</script>
<style scoped lang="scss"></style>
