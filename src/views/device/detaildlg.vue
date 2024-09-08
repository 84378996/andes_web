<template>
  <el-dialog
    v-model="innervisible"
    title="设备信息"
    :width="1000"
    destroy-on-close
    :before-close="dlgClose"
  >
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="详细信息" name="pane1">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="设备型号">
            <el-text> {{ dataItem.DeviceNo }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="设备名称">
            <el-text>{{ dataItem.DeviceName }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="IMEI">
            <el-text>{{ dataItem.IMEI }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="Unit">
            <el-text>{{ dataItem.Unit }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="JD">
            <el-text>{{ dataItem.JD }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="ThresholdMin">
            <el-text>{{ dataItem.ThresholdMin }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="ThresholdMax">
            <el-text>{{ dataItem.ThresholdMax }}</el-text>
          </el-descriptions-item>
        </el-descriptions>
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
import { GasDevice, resetDeviceInfo, apiGetDevice } from "@/api/gas";
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
      type: Object as () => GasDevice,
      default: () => {
        return { ID: 0 };
      },
    },
  },
  components: {},
  emits: {
    dialogCallback: (val: DialogResult) => true,
  },
  setup(props, { emit }) {
    const store = useStore();
    const innervisible = ref(props.visible);
    const loading = ref(false);
    const activeTab = ref("pane1");
    const dataItem = ref<GasDevice>({});
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
