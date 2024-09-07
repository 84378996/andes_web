<template>
  <el-dialog
    v-model="innervisible"
    title="用户信息"
    :width="1000"
    destroy-on-close
    :before-close="dlgClose"
  >
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="详细信息" name="pane1">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="登录名">
            <el-text> {{ dataItem.LoginName }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="用户姓名">
            <el-text>{{ dataItem.UserName }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="设备登录名">
            <el-text>{{ dataItem.DevUser }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="密码"> </el-descriptions-item>
          <el-descriptions-item label="电话">
            <el-text>{{ dataItem.Phone }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            <el-text>{{ dataItem.Email }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="部门">
            <el-text>{{ dataItem.Department }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="工号">
            <el-text>{{ dataItem.JobNumber }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-text v-if="dataItem.Enabled == 1">正常</el-text>
            <el-text v-else type="danger">禁用</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-text>{{ dataItem.RoleName }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="录入时间">
            <el-text>{{ dateTimeFormat(dataItem.AddTime) }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item />
          <el-descriptions-item label="备注说明" :span="2">
            <el-text>{{ dataItem.Remark }}</el-text>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="日志" name="pane2">
        <ModifyLogList :logList="logList"></ModifyLogList>
      </el-tab-pane>
    </el-tabs>

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
import { ElMessage } from "element-plus";
import { apiGetUser, UserCondition, UserInfo, resetUserInfo } from "@/api/user";
import { DialogResult } from "@/api/interface";
import { dateTimeFormat } from "@/api/format";
import ModifyLogList from "@/views/log/modifylist.vue";
export default defineComponent({
  name: "UserDetailDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => UserCondition,
      default: () => {
        return { ID: 0 };
      },
    },
  },
  components: { ModifyLogList },
  emits: {
    dialogCallback: (val: DialogResult) => true,
  },
  setup(props, { emit }) {
    const store = useStore();
    const innervisible = ref(props.visible);
    const loading = ref(false);
    const activeTab = ref("pane1");
    const dataItem = ref<UserInfo>({});
    const logList = ref([]);
    watch(
      () => props.visible,
      (newValue) => {
        innervisible.value = newValue;
        resetUserInfo(dataItem.value);
        logList.value = [];
        if (newValue === true) init();
      }
    );

    const init = () => {
      loading.value = true;
      activeTab.value = "pane1";

      apiGetUser({
        Data: { ID: props.param.ID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          dataItem.value = response.Data?.User;
          logList.value = response.Data?.Logs;
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };
    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };
    return {
      innervisible,
      activeTab,
      loading,
      dataItem,
      logList,
      dlgClose,
      dateTimeFormat,
    };
  },
});
</script>
<style lang="scss" scoped></style>
