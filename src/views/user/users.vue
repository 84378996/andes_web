<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
          <el-form-item label="登录名">
            <el-input v-model="ruleForm.LoginName" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="ruleForm.Name" />
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
            @click="handleEditPwd"
            :disabled="multipleSelection.length !== 1"
            >修改密码</el-button
          >
          <el-button
            class="red"
            icon="DeleteFilled"
            @click="handleDelete"
            :disabled="multipleSelection.length === 0"
            >删除</el-button
          >
          <el-button
            class="blue"
            icon="Download"
            @click="handleExport"
            :loading="loading"
            v-show="false"
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
        class="el-table-with-tool"
        v-loading="loading"
        :data="userList"
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
        <el-table-column label="状态" width="90px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text v-if="scope.row.Enabled == 1">正常</el-text>
            <el-text v-else type="danger">禁用</el-text>
          </template>
        </el-table-column>
        <el-table-column label="登录名" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.LoginName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="用户姓名" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.UserName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="角色" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.RoleName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" show-overflow-tooltip
          ><template v-slot="scope">
            <el-text>{{ dateTimeFormat(scope.row.AddTime) }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="备注说明" show-overflow-tooltip
          ><template v-slot="scope">
            <el-text>{{ scope.row.Remark }}</el-text>
          </template>
        </el-table-column>
      </el-table>

      <UserEditDlg
        :visible="isEditDlgVisible"
        :param="dlgParam"
        @dialogCallback="editDialogCallback"
      />
      <UserDetailDlg
        :visible="isDetailDlgVisible"
        :param="dlgParam"
        @dialogCallback="DetailDialogCallback"
      />
      <UserEditPwdDlg
        :visible="isEditPwdDlgVisible"
        :param="dlgParam"
        @dialogCallback="editPwdDialogCallback"
      ></UserEditPwdDlg>
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
import { defineComponent, ref, onMounted, reactive } from "vue";
import {
  UserCondition,
  UserInfo,
  apiGetUsers,
  apiModifyUser,
  apiDelUser,
  apiExportUser,
} from "@/api/user";
import { useStore } from "vuex";
import UserEditDlg from "./editdlg.vue";
import UserDetailDlg from "./detaildlg.vue";
import UserEditPwdDlg from "./editpwddlg.vue";
import { ResponseObject, DialogResult } from "@/api/interface";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateTimeFormat } from "@/api/format";
import {
  getColumnWidth,
  getRowIndex,
  columnSelectionWidth,
  columnOperateWidth,
} from "@/api/common";

export default defineComponent({
  name: "UserList",
  components: {
    UserEditDlg,
    UserDetailDlg,
    UserEditPwdDlg,
  },
  setup() {
    const store = useStore();

    const userList = ref<UserInfo[]>([]);
    const multipleSelection = ref<UserInfo[]>([]);

    const loading = ref(false);
    const columnIndexWidth = ref(50);
    const isAddDlgVisible = ref(false);
    const isEditDlgVisible = ref(false);
    const isDetailDlgVisible = ref(false);
    const isEditPwdDlgVisible = ref(false);

    const dlgParam = ref({});
    const ruleForm = reactive<UserCondition>({
      Name: "",
      PageIndex: 1,
      PageSize: 15,
      Enabled: null,
    });
    const query = ref<UserCondition>({});
    const total = ref(0);

    onMounted(() => {
      Object.assign(query.value, ruleForm);

      //refresh();
    });

    const refresh = () => {
      loading.value = true;
      userList.value = [];
      apiGetUsers({
        Data: query.value,
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          userList.value = response.Data?.Data;
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
      ruleForm.Name = "";
      ruleForm.Enabled = null;
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
      dlgParam.value = multipleSelection.value[0];
      isEditDlgVisible.value = true;
    };

    const handleEditPwd = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要编辑的行");
        return;
      }

      dlgParam.value = multipleSelection.value[0];
      isEditPwdDlgVisible.value = true;
    };

    const handleDelete = () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请先选择要删除的行");
        return;
      }

      var str = "";
      for (var i = 0; i < multipleSelection.value.length; i++) {
        var row = multipleSelection.value[i];

        str = str + "【" + row.Name + "】";
      }

      ElMessageBox.confirm("即将删除 " + str + " ,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apiDelUser({
            Array: multipleSelection.value,
            OperID: store.getters.user.ID,
          })
            .then(() => {
              ElMessage.success("删除成功");
              refresh();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
            });
        })
        .catch(() => {
          return;
        });
    };

    const handleExport = () => {
      if (userList.value.length === 0) {
        ElMessage.error("没有要导出的数据");
        return;
      }

      ElMessageBox.confirm("即将导出数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        loading.value = true;
        apiExportUser({
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
    const editDialogCallback = (param: DialogResult) => {
      isEditDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refresh();
    };
    const DetailDialogCallback = (param: DialogResult) => {
      if (param.show != undefined)
        isDetailDlgVisible.value = param.show ?? false;
    };
    const editPwdDialogCallback = (param: DialogResult) => {
      isEditPwdDlgVisible.value = param.show ?? false;
      if (param.refresh === true) refresh();
    };

    const menuEdit = (row: any) => {
      dlgParam.value = row;
      isEditDlgVisible.value = true;
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
        apiModifyUser({
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
        apiDelUser({
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
      userList,
      ruleForm,
      query,
      loading,
      total,
      isAddDlgVisible,
      isEditDlgVisible,
      isDetailDlgVisible,
      isEditPwdDlgVisible,
      dlgParam,
      multipleSelection,
      columnIndexWidth,
      columnSelectionWidth,
      columnOperateWidth,
      refresh,
      dateTimeFormat,
      handleQuery,
      handleQueryClear,
      handleAdd,
      handleCurrentChange,
      handleSizeChange,
      handleEdit,
      handleDelete,
      handleExport,

      showAddDialog,
      editDialogCallback,
      DetailDialogCallback,
      editPwdDialogCallback,
      menuEdit,
      handleEditPwd,
      menuDetail,
      menuEnabled,
      menuDelete,
      handleSelectionChange,
      getRowIndex,
    };
  },
});
</script>
