<template>
  <el-container class="app-container">
    <el-header class="header-container"> </el-header>
    <el-main class="main-container">
      <div class="container-space-between">
        <el-text tag="b">设备信息</el-text>
        <span></span>
      </div>
      <el-descriptions :column="4" border class="descriptions-monitor">
        <el-descriptions-item label="设备名称" :span="2">
          <el-text type="primary"> {{ wms.DeviceName }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="联机状态" :span="2">
          <el-space v-if="wms.Online === true">
            <el-tag type="success" effect="dark">在线</el-tag>
            <el-tag
              v-if="isAlarm(wms.WMSData?.Errors) === true"
              type="danger"
              effect="dark"
              >报警</el-tag
            >
          </el-space>
          <el-tag v-else type="info" effect="dark">离线</el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="设备状态" :span="2">
          <el-text v-if="wms.Online">{{ wms.WMSData?.DevStatus }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="设备模式" :span="2">
          <el-text v-if="wms.Online">{{
            DeviceModeStr(wms.WMSData?.DevMode)
          }}</el-text>
        </el-descriptions-item>
      </el-descriptions>
      <div class="space-height-10"></div>
      <div class="container-space-between">
        <el-text tag="b">板材信息</el-text>
        <span></span>
      </div>
      <div class="el-table-border">
        <el-table
          ref="table"
          :data="wms.WMSData?.Cells"
          stripe
          highlight-current-row
        >
          <el-table-column label="#" width="70px" fixed show-overflow-tooltip>
            <template v-slot="scope">
              <el-text> {{ scope.$index + 1 }}</el-text>
            </template>
          </el-table-column>

          <el-table-column label="column" show-overflow-tooltip>
            <template v-slot="scope">
              <el-text>{{ scope.row.column }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="row" show-overflow-tooltip>
            <template v-slot="scope">
              <el-text>{{ scope.row.row }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="数量" show-overflow-tooltip
            ><template v-slot="scope">
              <el-text>{{ scope.row.num }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="材料" show-overflow-tooltip>
            <template v-slot="scope">
              <el-text>{{ scope.row.material }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="长(mm)" width="200px" show-overflow-tooltip
            ><template v-slot="scope">
              <el-text>{{ scope.row.length }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="宽(mm)" show-overflow-tooltip
            ><template v-slot="scope">
              <el-text>{{ scope.row.width }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="厚(mm)" show-overflow-tooltip
            ><template v-slot="scope">
              <el-text>{{ scope.row.thickness }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="料框状态" show-overflow-tooltip
            ><template v-slot="scope">
              <el-text>{{ WMSCellTypeStr(scope.row.type) }}</el-text>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="space-height-10"></div>
      <div class="container-space-between">
        <el-text tag="b">报警信息</el-text>
        <span></span>
      </div>

      <div class="el-table-border">
        <el-table
          ref="table"
          :data="wms.WMSData?.Errors"
          stripe
          highlight-current-row
        >
          <el-table-column label="#" width="70px" fixed show-overflow-tooltip>
            <template v-slot="scope">
              <el-text> {{ scope.$index + 1 }}</el-text>
            </template>
          </el-table-column>

          <el-table-column label="类型" width="150px" show-overflow-tooltip>
            <template v-slot="scope">
              <el-text>{{ scope.row.AlarmType }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="报警编号" width="150px" show-overflow-tooltip>
            <template v-slot="scope">
              <el-text>{{ scope.row.AlarmID }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="维护代码" width="150px" show-overflow-tooltip>
            <template v-slot="scope">
              <el-text>{{ scope.row.MaintainCode }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="报警时间" width="200px" show-overflow-tooltip
            ><template v-slot="scope">
              <el-text>{{ dateTimeFormat(scope.row.StartTime) }}</el-text>
            </template>
          </el-table-column>
          <el-table-column label="报警内容" show-overflow-tooltip
            ><template v-slot="scope">
              <el-text>{{ scope.row.AlarmMessage }}</el-text>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-footer class="footer-container">
      <el-text type="danger">{{ message }}</el-text>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import {
  DeviceGroup,
  apiGetWMS,
  DeviceModeStr,
  WMSCellTypeStr,
} from "@/api/devreal";
import { useRoute } from "vue-router";
import { isAlarm } from "@/api/devalarm";
import { useStore } from "vuex";
import { apiGetDisplayCycleTime } from "@/api/datadic";
import { ElMessage } from "element-plus";
import { dateTimeFormat, currentDateTime } from "@/api/format";
import { ErrorCode } from "@/api/log";
export default defineComponent({
  name: "WMSMonitor",

  setup() {
    const store = useStore();
    const route = useRoute();
    const wms = ref<DeviceGroup>({
      DeviceID: 0,
      Online: false,
      WMSData: null,
    });
    const message = ref("");
    const cycleTime = ref(5);
    const timer = ref(0);
    onMounted(() => {
      if (route.params.value !== undefined) {
        const val = Array.isArray(route.params.value)
          ? route.params.value[0]
          : route.params.value;
        wms.value.DeviceID = parseInt(val);
      }
      getCycleTime();
    });
    onBeforeUnmount(() => {
      clearInterval(timer.value);
    });
    const getCycleTime = () => {
      apiGetDisplayCycleTime()
        .then((response) => {
          cycleTime.value = response.Data.Monitor;
          timer.value = setInterval(refreshData, 1000 * cycleTime.value);
          refreshData();
        })
        .catch((error) => {
          ElMessage.error(error.Msg);
          timer.value = setInterval(refreshData, 1000 * cycleTime.value);
        });
    };
    const refreshData = () => {
      apiGetWMS({
        Data: { DevID: wms.value.DeviceID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          wms.value = response.Data;
          message.value = "";
        })
        .catch((error) => {
          wms.value.Online = false;
          message.value = "【" + currentDateTime() + "】" + error.Msg;
          if (error.Code === ErrorCode.NoPermission) {
            //没有权限，关闭定时器
            clearInterval(timer.value);
            ElMessage.error(error.Msg);
          }
        });
    };
    return {
      wms,
      message,
      isAlarm,

      dateTimeFormat,
      DeviceModeStr,
      WMSCellTypeStr,
    };
  },
});
</script>
