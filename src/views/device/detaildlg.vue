<template>
  <div class="dialog-container">
    <el-dialog
      v-model="innervisible"
      title="设备信息"
      :width="1000"
      destroy-on-close
      center
      :before-close="dlgClose"
    >
      <el-tabs type="border-card" v-model="activeTab">
        <el-tab-pane label="详细信息" name="pane1">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="设备名称">
              {{ dataItem.DevText }}
            </el-descriptions-item>
            <el-descriptions-item label="设备类型">
              {{ dataItem.DevType }}
            </el-descriptions-item>
            <el-descriptions-item label="IP">
              <el-text>{{ dataItem.IP }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-space>
                <el-text v-if="dataItem.Enabled == 1">正常</el-text>
                <el-text v-else-if="dataItem.Enabled == 2" type="warning"
                  >维修中</el-text
                >
                <el-text v-else-if="dataItem.Enabled == 3" type="danger"
                  >报废</el-text
                >
                <el-text v-else-if="dataItem.Enabled == 4" type="info"
                  >闲置</el-text
                >
                <el-tag v-if="dataItem.Test">测试中</el-tag>
              </el-space>
            </el-descriptions-item>

            <el-descriptions-item label="Ftp主机">
              <el-text>{{ dataItem.FtpHost }} </el-text>
            </el-descriptions-item>
            <el-descriptions-item label="Ftp端口号">
              <el-text> {{ dataItem.FtpPort }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="Ftp用户名">
              <el-text> {{ dataItem.FtpUser }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="Ftp密码">
              <el-text>{{ dataItem.FtpPwd }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="Ftp根目录" :span="2">
              <el-text>{{ dataItem.FtpRoot }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="url 1" :span="2">
              <el-text> {{ dataItem.Url1 }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="url 2" :span="2">
              <el-text> {{ dataItem.Url2 }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="url 3" :span="2">
              <el-text> {{ dataItem.Url3 }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="通讯标识">
              <el-text> {{ dataItem.DevName }}</el-text>
            </el-descriptions-item>
            <el-descriptions-item label="录入时间">
              <el-text>{{ dateTimeFormat(dataItem.AddTime) }}</el-text>
            </el-descriptions-item>

            <el-descriptions-item label="说明" :span="2">
              <el-text> {{ dataItem.Remark }}</el-text>
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
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import {
  apiGetDevice,
  DeviceCondition,
  DeviceInfo,
  resetDeviceInfo,
} from "@/api/device";
import { DialogResult } from "@/api/interface";
import { dateTimeFormat } from "@/api/format";
import ModifyLogList from "@/views/log/modifylist.vue";
export default defineComponent({
  name: "DeviceDetailDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => DeviceCondition,
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
    const dataItem = ref<DeviceInfo>({});
    const logList = ref([]);
    watch(
      () => props.visible,
      (newValue) => {
        innervisible.value = newValue;
        resetDeviceInfo(dataItem.value);
        logList.value = [];
        if (newValue === true) init();
      }
    );

    const init = () => {
      loading.value = true;
      activeTab.value = "pane1";

      apiGetDevice({
        Data: { ID: props.param.ID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          dataItem.value = response.Data?.Data;
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
