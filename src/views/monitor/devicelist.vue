<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
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

        <!-- <el-table-column label="操作" :width="columnOperateWidth">
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
        </el-table-column> -->
        <el-table-column label="设备名称" width="180px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.DeviceName }}</el-text>
          </template>
        </el-table-column>
        <!-- <el-table-column label="IMEI" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.IMEI }}</el-text>
          </template>
        </el-table-column> -->
        <el-table-column label="浓度" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.CurrentValue }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="上报时间" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text> {{ dateTimeFormat(scope.row.RecordTime) }}</el-text>
          </template>
        </el-table-column>
        <!-- <el-table-column label="在线状态" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text> {{ scope.row.OnlineStatus }}</el-text>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <DeviceDetailDlg
          :visible="isDetailDlgVisible"
          :param="dlgParam"
          @dialogCallback="detailDialogCallback"
        /> -->
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
import DeviceDetailDlg from "./detaildlg.vue";
import {
  getColumnWidth,
  getRowIndex,
  columnSelectionWidth,
  columnOperateWidth,
} from "@/api/common";
import { DeviceRecord, apiGetDeviceRecords, DeviceCondition } from "@/api/gas";
import { dateTimeFormat } from "@/api/format";
import { DialogResult } from "@/api/interface";
export default defineComponent({
  name: "DeviceHList",
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

    const dlgParam = ref<DeviceRecord>({
      ID: 0,
    });
    const loading = ref(false);
    const total = ref(0);
    const ruleForm = reactive<DeviceCondition>({
      DeviceNo: null, //设备型号
      StartTime: null,
      EndTime: null,
      Status: null,
      PageIndex: 1,
      PageSize: 15,
    });
    const query = ref<DeviceCondition>({});

    const devicelist = ref<DeviceRecord[]>([]);
    const multipleSelection = ref<DeviceRecord[]>([]);
    const taskLineOptions = ref<KeyValuePair[]>([]);
    onMounted(() => {
      ruleForm.PageIndex = 1;
      Object.assign(query.value, ruleForm);
      refreshList();
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
    };

    const refreshList = () => {
      loading.value = true;
      devicelist.value = [];
      apiGetDeviceRecords({
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
      row: DeviceRecord;
      index: number;
    }) => {
      //注意  不要与stripe 斑马纹混合使用，否则无效
      //if (row.OnlineStatus === 1) {
      //  return "brand-row";
      // } else if (row.OnlineStatus === 2) {
      //    return "warning-row";
      //   } else {
      //    return "";
      //  }
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

    return {
      loading,
      devicelist,
      isDetailDlgVisible,
      isModifyTaskCutsDlgVisible,
      isEditDlgVisible,
      multipleSelection,
      dlgParam,
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
      detailDialogCallback,
      columnIndexWidth,
      getRowIndex,
    };
  },
});
</script>
<style scoped lang="scss"></style>
