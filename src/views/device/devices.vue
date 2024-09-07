<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-input v-model="ruleForm.DevText" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="ruleForm.Enabled" placeholder="状态" clearable>
              <el-option :value="1" label="正常"></el-option>
              <el-option :value="2" label="维修中"></el-option>
              <el-option :value="3" label="报废"></el-option>
              <el-option :value="4" label="闲置"></el-option>
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
          <el-button class="green" @click="handleAdd" icon="Plus" disabled
            >添加</el-button
          >
          <el-button class="orange" icon="Edit" @click="handleEdit"
            >编辑</el-button
          >
          <el-button
            class="red"
            icon="DeleteFilled"
            @click="handleDelete"
            disabled
            >删除</el-button
          >
          <el-button
            class="blue"
            icon="Download"
            @click="handleExport"
            :loading="loading"
            >导出</el-button
          ></el-space
        >

        <el-button
          class="green"
          @click="refresh"
          icon="Refresh"
          :loading="loading"
          >刷新</el-button
        >
      </div>
    </el-header>
    <el-main class="main-container container-border">
      <el-table
        ref="table"
        v-loading="loading"
        :data="deviceList"
        class="el-table-with-tool"
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
        <el-table-column label="设备名称" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.DevText }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="状态" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text v-if="scope.row.Enabled == 1">正常</el-text>
            <el-text v-else-if="scope.row.Enabled == 2" type="warning"
              >维修中</el-text
            >
            <el-text v-else-if="scope.row.Enabled == 3" type="danger"
              >报废</el-text
            >
            <el-text v-else-if="scope.row.Enabled == 4" type="info"
              >闲置</el-text
            >
          </template>
        </el-table-column>

        <el-table-column label="最小值" show-overflow-tooltip
          ><template v-slot="scope">
            <el-text>{{ scope.row.thresholdmin }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="最大值" show-overflow-tooltip
          ><template v-slot="scope">
            <el-text>{{ scope.row.thresholdmin }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="单位" show-overflow-tooltip
          ><template v-slot="scope">
            <el-text>{{ scope.row.thresholdmin }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="备注说明" show-overflow-tooltip
          ><template v-slot="scope">
            <el-text>{{ scope.row.Remark }}</el-text>
          </template>
        </el-table-column>
      </el-table>

      <DeviceEditDlg
        :visible="isEditDlgVisible"
        :param="dlgParam"
        @dialogCallback="EditDialogCallback"
      />
      <DeviceDetailDlg
        :visible="isDetailDlgVisible"
        :param="dlgParam"
        @dialogCallback="DetailDialogCallback"
      />
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
    <!-- <device-add-dlg
      :visible="isAddDlgVisible"
      :param="dlgParam"
      @dlgchangeshow="showAddDialog"
    />-->

    <!--<device-edit-comm-dlg
      :visible="isEditCommDlgVisible"
      :param="dlgParam"
      @dlgchangeshow="showEditCommDialog"
    /> -->
  </el-container>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, reactive } from "vue";
import {
  DeviceCondition,
  DeviceInfo,
  apiGetDevices,
  apiModifyDevice,
  apiDelDevice,
  exportDevice,
} from "@/api/device";

import { useStore } from "vuex";
//import DeviceAddDlg from "./adddlg.vue";
import DeviceEditDlg from "./editdlg.vue";
import DeviceDetailDlg from "./detaildlg.vue";
//import DeviceEditDlg from "./editcommdlg.vue";
import { ResponseObject, DialogResult } from "@/api/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getColumnWidth,
  getRowIndex,
  columnSelectionWidth,
  columnOperateWidth,
} from "@/api/common";
export default defineComponent({
  name: "DeviceList",
  components: {
    //DeviceAddDlg,
    DeviceEditDlg,
    DeviceDetailDlg,
    //DeviceEditCommDlg,
  },
  setup() {
    const store = useStore();

    const deviceList = ref<DeviceInfo[]>([]);
    const multipleSelection = ref<DeviceInfo[]>([]);

    const loading = ref(false);

    const isAddDlgVisible = ref(false);
    const isEditDlgVisible = ref(false);
    const isDetailDlgVisible = ref(false);
    const isEditCommDlgVisible = ref(false);
    const columnIndexWidth = ref(50);
    const dlgParam = ref({});
    const ruleForm = reactive<DeviceCondition>({
      DevText: "",
      PageIndex: 1,
      PageSize: 15,
      Enabled: null,
    });
    const query = ref<DeviceCondition>({});
    const total = ref(0);

    onMounted(() => {
      Object.assign(query.value, ruleForm);

      //refresh();
    });

    const refresh = () => {
      loading.value = true;
      deviceList.value = [];
      apiGetDevices({
        Data: query.value,
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          deviceList.value = response.Data?.Data;
          loading.value = false;
          total.value = response.Data?.Total;
          columnIndexWidth.value = getColumnWidth(query.value);
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    const handleQuery = () => {
      ruleForm.PageIndex = 1;
      Object.assign(query.value, ruleForm);
      refresh();
    };

    const handleQueryClear = () => {
      ruleForm.DevText = "";
      ruleForm.Enabled = null;
    };

    const handleAdd = () => {
      dlgParam.value = { ID: 0 };
      isAddDlgVisible.value = true;
    };

    const handleEdit = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要编辑的行");
        return;
      }
      dlgParam.value = multipleSelection.value[0];
      isEditDlgVisible.value = true;
    };

    const handleEditComm = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要编辑的行");
        return;
      }

      dlgParam.value = multipleSelection.value[0];
      isEditCommDlgVisible.value = true;
    };

    const handleDelete = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要删除的行");
        return;
      }
      var list: DeviceCondition[] = [];
      var str = "";
      for (var i = 0; i < multipleSelection.value.length; i++) {
        var row = multipleSelection.value[i];
        list.push({ ID: row.ID });
        str = str + row.DevText + ",";
      }

      ElMessageBox.confirm("即将永久删除[" + str + "],是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        apiDelDevice({
          Array: list,
          OperID: store.getters.user.ID,
        })
          .then(() => {
            ElMessage.success("删除成功");
            refresh();
          })
          .catch((error) => {
            ElMessage.error(error.Msg);
          });
      });
    };

    const handleEnabled = (val: number) => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要编辑的行");
        return;
      }
      var list: DeviceCondition[] = [];
      var str = "";
      for (var i = 0; i < multipleSelection.value.length; i++) {
        var row = multipleSelection.value[i];
        list.push({ ID: row.ID, Enabled: val });
        str = str + row.DevText + ",";
      }
      ElMessageBox.confirm("即将操作[" + str + "],是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        apiModifyDevice({
          Array: list,
          OperID: store.getters.user.ID,
        })
          .then(() => {
            ElMessage.success("提交成功");
            refresh();
          })
          .catch((error) => {
            ElMessage.error(error.Msg);
          });
      });
    };

    const handleExport = () => {
      if (deviceList.value.length === 0) {
        ElMessage.error("没有要导出的数据");
        return;
      }

      ElMessageBox.confirm("即将导出数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        loading.value = true;
        exportDevice({
          Data: query.value,
          OperID: store.getters.user.ID,
        })
          .then((response: ResponseObject) => {
            loading.value = false;
            window.location.href = response.Data?.Url;
          })
          .catch((error) => {
            loading.value = false;
            ElMessage.error(error.Msg);
          });
      });
    };

    const handleCurrentChange = (val: number) => {
      ruleForm.PageIndex = val;
      Object.assign(query.value, ruleForm);
      refresh();
    };

    const handleSizeChange = (val: number) => {
      ruleForm.PageSize = val;
      Object.assign(query.value, ruleForm);
      refresh();
    };

    const showAddDialog = (param: any) => {
      isAddDlgVisible.value = param.show;
      if (param.isrefresh === true) refresh();
    };
    const EditDialogCallback = (param: DialogResult) => {
      isEditDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refresh();
    };
    const DetailDialogCallback = (param: DialogResult) => {
      if (param.show != undefined)
        isDetailDlgVisible.value = param.show ?? false;
    };
    const showEditCommDialog = (param: DialogResult) => {
      isEditCommDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refresh();
    };

    const menuEdit = (row: any) => {
      dlgParam.value = row;
      isEditDlgVisible.value = true;
    };
    const menuEditComm = (row: any) => {
      dlgParam.value = row;
      isEditCommDlgVisible.value = true;
    };
    const menuDetail = (row: any) => {
      dlgParam.value = { ID: row.ID };
      isDetailDlgVisible.value = true;
    };
    const menuEnabled = (row: any, val: number) => {
      ElMessageBox.confirm("即将操作[" + row.Name + "],是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        apiModifyDevice({
          Data: { ID: row.ID, Enabled: val },
          OperID: store.getters.user.ID,
        })
          .then(() => {
            ElMessage.success("提交成功");
            refresh();
          })
          .catch((error) => {
            ElMessage.error(error.Msg);
          });
      });
    };
    const menuDelete = (row: any) => {
      ElMessageBox.confirm("即将永久删除[" + row.Name + "],是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        apiDelDevice({
          Data: row,
          OperID: store.getters.user.ID,
        })
          .then(() => {
            ElMessage.success("删除成功");
            refresh();
          })
          .catch((error) => {
            ElMessage.error(error.Msg);
          });
      });
    };

    const handleSelectionChange = (val: any) => {
      multipleSelection.value = val;
    };

    return {
      deviceList,
      columnIndexWidth,
      ruleForm,
      query,
      loading,
      total,
      isAddDlgVisible,
      isEditDlgVisible,
      isDetailDlgVisible,
      isEditCommDlgVisible,
      dlgParam,
      columnOperateWidth,
      columnSelectionWidth,
      refresh,
      handleQuery,
      handleQueryClear,
      handleAdd,
      handleCurrentChange,
      handleSizeChange,
      handleEdit,
      handleEditComm,
      handleDelete,
      handleEnabled,
      handleExport,
      getRowIndex,
      showAddDialog,
      EditDialogCallback,
      DetailDialogCallback,
      showEditCommDialog,
      menuEdit,
      menuEditComm,
      menuDetail,
      menuEnabled,
      menuDelete,
      handleSelectionChange,
    };
  },
});
</script>
