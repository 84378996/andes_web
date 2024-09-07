<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <!-- <el-form :inline="true" v-show="false">
        <el-form-item label="设备名称">
          <el-select
            v-model="marker.DeviceID"
            value-key="ID"
            placeholder="请选择"
          >
            <el-option :key="1" label="打码机#1" :value="1" />
            <el-option :key="2" label="打码机#2" :value="2" />
          </el-select>
        </el-form-item>
      </el-form> -->
    </el-header>
    <el-main class="main-container">
      <div class="container-space-between">
        <el-text tag="b">设备信息</el-text>
        <span></span>
      </div>
      <el-descriptions :column="4" border>
        <el-descriptions-item label="设备名称" :span="2">
          <el-text type="primary"> {{ marker.DeviceName }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="联机状态" :span="2">
          <el-space v-if="marker.Online === true">
            <el-tag type="success" effect="dark">在线</el-tag>
            <el-tag
              v-if="isAlarm(marker.MarkerData?.Errors) === true"
              type="danger"
              effect="dark"
              >报警</el-tag
            >
          </el-space>
          <el-tag v-else type="info" effect="dark">离线</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备状态" :span="2">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.DevStatus }}</el-text
          >
        </el-descriptions-item>

        <el-descriptions-item label="设备模式" :span="2">
          <el-text v-if="marker.Online">
            {{ DeviceModeStr(marker.MarkerData?.DevMode) }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="打码程序" :span="2">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CurrentProg }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="时间" :span="2">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CreateTime }}</el-text
          >
        </el-descriptions-item>

        <el-descriptions-item label="运行累计时间">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RunTotalTime }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="故障累计时间">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RunFaultTime }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="待机累计时间">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RunStandbyTime }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="工作累计时间">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RunWorkingTime }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="实时电表度数">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PowerReal }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="日耗电度数">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PowerDay }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="月耗电度数">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PowerMonth }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="年耗电度数">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PowerYear }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="日钢板数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.SteelDay }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="月钢板数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.SteelMonth }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="年钢板数量" :span="2">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.SteelYear }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="日喷码数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeDay }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="月喷码数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeMonth }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="年喷码数量" :span="2">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeYear }}</el-text
          >
        </el-descriptions-item>

        <el-descriptions-item label="日喷码OK数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeOkDay }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="月喷码OK数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeOkMonth }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="年喷码OK数量" :span="2">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeOkYear }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="日喷码NG数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeNgDay }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="月喷码NG数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeNgMonth }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="年喷码NG数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.CodeNgYear }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="单张钢板已打码数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PlateCodeTotal }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="单张钢板已打码OK数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PlateCodeOk }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="单张钢板已打码NG数量">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PlateCodeNg }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="单张钢板打码耗时（秒）" :span="2">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.PlateCodeUse }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="当日打码OK良率">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RateCurrentDay }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="当月打码OK良率">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RateCurrentMonth }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="当年打码OK良率">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RateCurrentYear }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="当张钢板打码OK良率">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.RateCurrentPlate }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="日钢板打码耗时">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.UseTimeDay }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="月钢板打码耗时">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.UseTimeMonth }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="年钢板打码耗时">
          <el-text v-if="marker.Online">
            {{ marker.MarkerData?.UseTimeYear }}</el-text
          >
        </el-descriptions-item>
      </el-descriptions>

      <div class="space-height-10"></div>
      <div class="container-space-between">
        <el-text tag="b">报警信息</el-text>
        <span></span>
      </div>

      <el-table
        ref="table"
        :data="marker.MarkerData?.Errors"
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
    </el-main>
    <el-footer class="footer-container">
      <el-text type="danger">{{ message }}</el-text>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from "vue";
import { DeviceGroup, apiGetMarker, DeviceModeStr } from "@/api/devreal";
import { isAlarm } from "@/api/devalarm";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { apiGetDisplayCycleTime } from "@/api/datadic";
import { ElMessage } from "element-plus";
import { dateTimeFormat, currentDateTime } from "@/api/format";
import { ErrorCode } from "@/api/log";
export default defineComponent({
  name: "MarkerMonitor",

  setup() {
    const store = useStore();
    const marker = ref<DeviceGroup>({
      DeviceID: 0,
      Online: false,
      MarkerData: null,
    });
    const route = useRoute();
    const message = ref("");
    const cycleTime = ref(5);
    const timer = ref(0);
    onMounted(() => {
      // if (route.params.devid !== undefined) {
      //   const val = Array.isArray(route.params.value)
      //     ? route.params.value[0]
      //     : route.params.value;
      //   marker.value.DeviceID = parseInt(val);
      // }
      if (route.params.value !== undefined) {
        const val = Array.isArray(route.params.value)
          ? route.params.value[0]
          : route.params.value;
        marker.value.DeviceID = parseInt(val);
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
      apiGetMarker({
        Data: { DevID: marker.value.DeviceID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          marker.value = response.Data;
          message.value = "";
        })
        .catch((error) => {
          marker.value.Online = false;
          message.value = "【" + currentDateTime() + "】" + error.Msg;
          if (error.Code === ErrorCode.NoPermission) {
            //没有权限，关闭定时器
            clearInterval(timer.value);
            ElMessage.error(error.Msg);
          }
        });
    };

    return {
      marker,
      message,
      isAlarm,
      dateTimeFormat,
      DeviceModeStr,
    };
  },
});
</script>
