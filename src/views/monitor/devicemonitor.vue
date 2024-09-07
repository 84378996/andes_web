<template>
  <el-container class="app-container">
    <el-header class="header-container"> </el-header>
    <el-main class="main-container">
      <el-space wrap size="large" alignment="flex-start">
        <el-card class="card-monitor" v-for="item in wms" :key="item.DeviceID">
          <template #header>
            <div
              class="card-monitor-header"
              :class="{
                offline: item.Online === false,
                online:
                  item.Online === true &&
                  isAlarm(item.WMSData?.Errors) === false,
                alarm:
                  item.Online === true &&
                  isAlarm(item.WMSData?.Errors) === true,
              }"
            >
              <el-text>{{ item.DeviceName }}</el-text>
              <el-text v-if="item.Online">在线</el-text>
              <el-text v-else>离线</el-text>
              <el-button
                class="el-button-noborder"
                type="primary"
                @click="handleWMS(item)"
                >查看明细</el-button
              >
            </div>
          </template>
          <div class="card-monitor-body">
            <el-descriptions :column="2" border class="descriptions-monitor">
              <el-descriptions-item label="设备状态">
                <el-text v-if="item.Online">{{
                  item.WMSData?.DevStatus
                }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="设备模式">
                <el-text v-if="item.Online">{{
                  DeviceModeStr(item.WMSData?.DevMode)
                }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item
                label="板材信息"
                :span="6"
              ></el-descriptions-item>
              <el-descriptions-item label="报警信息" :span="2">
                <el-text v-if="item.Online" type="danger">{{
                  alarmArrStr(item.WMSData?.Errors)
                }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
        <el-card class="card-monitor" v-for="item in sxl" :key="item.DeviceID">
          <template #header>
            <div
              class="card-monitor-header"
              :class="{
                offline: item.Online === false,
                online:
                  item.Online === true &&
                  isAlarm(item.DeliveryData?.Errors) === false,
                alarm:
                  item.Online === true &&
                  isAlarm(item.DeliveryData?.Errors) === true,
              }"
            >
              <el-text>{{ item.DeviceName }}</el-text>
              <el-text v-if="item.Online">在线</el-text>
              <el-text v-else>离线</el-text>
              <el-button
                class="el-button-noborder"
                type="primary"
                @click="handleSXL(item)"
                >查看明细</el-button
              >
            </div>
          </template>
          <div class="card-monitor-body">
            <el-descriptions :column="2" border class="descriptions-monitor">
              <el-descriptions-item label="设备状态">
                <div v-if="item.Online">
                  <el-text>
                    {{
                      DeliveryStatusStr(item.DeliveryData?.DeviceStatus)
                    }}</el-text
                  >
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="设备模式">
                <el-text v-if="item.Online">{{
                  DeviceModeStr(item.DeliveryData?.DeviceMode)
                }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="任务状态" :span="2">
                <div v-if="item.Online">
                  <el-text v-if="item.DeliveryData?.TaskStatus === 1">
                    执行中</el-text
                  >
                  <el-text v-else> 未执行</el-text>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="上下料" :span="2">
                <div v-if="item.Online">
                  <el-text>{{ DeliveryWorkingStr(item.DeliveryData) }}</el-text>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="报警信息" :span="2">
                <el-text v-if="item.Online" type="danger">{{
                  alarmArrStr(item.DeliveryData?.Errors)
                }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>

        <el-card
          class="card-monitor"
          v-for="item in marker"
          :key="item.DeviceID"
        >
          <template #header>
            <div
              class="card-monitor-header"
              :class="{
                offline: item.Online === false,
                online:
                  item.Online === true &&
                  isAlarm(item.MarkerData?.Errors) === false,
                alarm:
                  item.Online === true &&
                  isAlarm(item.MarkerData?.Errors) === true,
              }"
            >
              <el-text>{{ item.DeviceName }}</el-text>
              <el-text v-if="item.Online">在线</el-text>
              <el-text v-else>离线</el-text>

              <el-button
                class="el-button-noborder"
                type="primary"
                @click="handleMarker(item)"
                >查看明细</el-button
              >
            </div>
          </template>
          <div class="card-monitor-body">
            <el-descriptions :column="2" border class="descriptions-monitor">
              <el-descriptions-item label="设备状态">
                <el-text v-if="item.Online">
                  {{ item.MarkerData?.DevStatus }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="设备模式">
                <el-text v-if="item.Online">
                  {{ DeviceModeStr(item.MarkerData?.DevMode) }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="打码程序" :span="2">
                <el-text v-if="item.Online">
                  {{ item.MarkerData?.CurrentProg }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="钢板打码">
                <el-text v-if="item.Online">
                  {{ item.MarkerData?.PlateCodeTotal }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="当日钢板数">
                <el-text v-if="item.Online">
                  {{ item.MarkerData?.SteelDay }}</el-text
                >
              </el-descriptions-item>

              <el-descriptions-item label="当日喷码数">
                <el-text v-if="item.Online">
                  {{ item.MarkerData?.CodeDay }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="当日成功率">
                <el-text v-if="item.Online">
                  {{
                    numberFormat(item.MarkerData?.RateCurrentDay, 2)
                  }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="报警信息" :span="2">
                <el-text v-if="item.Online" type="danger">{{
                  alarmArrStr(item.MarkerData?.Errors)
                }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>

        <el-card
          class="card-monitor"
          v-for="item in laser"
          :key="item.DeviceID"
        >
          <template #header>
            <div
              class="card-monitor-header"
              :class="{
                offline: item.Online === false,
                online:
                  item.Online === true &&
                  isAlarm(item.LaserData?.Errors) === false,
                alarm:
                  item.Online === true &&
                  isAlarm(item.LaserData?.Errors) === true,
              }"
            >
              <el-text>{{ item.DeviceName }}</el-text>
              <el-text v-if="item.Online">在线</el-text>
              <el-text v-else>离线</el-text>
              <el-button
                class="el-button-noborder"
                type="primary"
                @click="handleLaser(item)"
                >查看明细</el-button
              >
            </div>
          </template>
          <div class="card-monitor-body">
            <el-descriptions :column="2" border class="descriptions-monitor">
              <el-descriptions-item label="设备状态">
                <div v-if="item.Online">
                  <el-text> {{ item.LaserData?.DevStatus }}</el-text>
                </div>
              </el-descriptions-item>
              <el-descriptions-item label="设备模式">
                <el-text v-if="item.Online">{{
                  DeviceModeStr(item.LaserData?.DevMode)
                }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="加工文件" :span="2">
                <el-text v-if="item.Online">
                  {{ item.LaserData?.CutProg }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="钢板" :span="2">
                <el-text v-if="item.Online">
                  {{ item.LaserData?.Material
                  }}{{ numberFormat(item.LaserData?.Length, 2) }}*{{
                    numberFormat(item.LaserData?.Width, 2)
                  }}*{{ numberFormat(item.LaserData?.Thick, 2) }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="切割长度">
                <el-text v-if="item.Online">
                  {{ numberFormat(item.LaserData?.CutLength, 2) }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="切割时间">
                <el-text v-if="item.Online">
                  {{ item.LaserData?.CutTime }}</el-text
                >
              </el-descriptions-item>
              <el-descriptions-item label="报警信息" :span="2">
                <el-text v-if="item.Online" type="danger">{{
                  alarmArrStr(item.LaserData?.Errors)
                }}</el-text>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-space>
    </el-main>
    <el-footer class="footer-container">
      <el-text type="danger">{{ message }}</el-text>
    </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  apiGetAll,
  DeviceGroup,
  DeliveryStatusStr,
  DeliveryWorkingStr,
  DeviceModeStr,
} from "@/api/devreal";
import { alarmArrStr, isAlarm } from "@/api/devalarm";
import { ErrorCode } from "@/api/log";
import { numberFormat } from "@/api/format";
import { apiGetDisplayCycleTime } from "@/api/datadic";
import { ElMessage } from "element-plus";
import moment from "moment";
import { useStore } from "vuex";
export default defineComponent({
  name: "DeviceMonitor",
  setup() {
    const router = useRouter();
    const store = useStore();
    const wms = ref<DeviceGroup[]>([
      {
        DeviceID: 0,
        Online: false,
        WMSData: null,
      },
    ]);
    const sxl = ref<DeviceGroup[]>([
      {
        DeviceID: 0,
        Online: false,
        DeliveryData: null,
      },
      {
        DeviceID: 0,
        Online: false,
        DeliveryData: null,
      },
    ]);

    const marker = ref<DeviceGroup[]>([
      {
        DeviceID: 0,
        Online: false,
        MarkerData: null,
      },
      {
        DeviceID: 0,
        Online: false,
        MarkerData: null,
      },
    ]);

    const laser = ref<DeviceGroup[]>([
      {
        DeviceID: 0,
        Online: false,
        LaserData: null,
      },
      {
        DeviceID: 0,
        Online: false,
        LaserData: null,
      },
      {
        DeviceID: 0,
        Online: false,
        LaserData: null,
      },
      {
        DeviceID: 0,
        Online: false,
        LaserData: null,
      },
    ]);

    const timer = ref(0);
    const message = ref("");
    const cycleTime = ref(5);

    // Stop the timer and clear the timeout when the component is about to be unmounted
    onBeforeUnmount(() => {
      clearInterval(timer.value);
    });
    onMounted(() => {
      getCycleTime();
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
      apiGetAll({ Data: {}, OperID: store.getters.user.ID })
        .then((response) => {
          wms.value = response.Data.wms;
          sxl.value = response.Data.slx;
          marker.value = response.Data.marker;
          laser.value = response.Data.laser;

          message.value = "";
        })
        .catch((error) => {
          for (const m of wms.value) {
            m.Online = false;
          }

          for (const m of sxl.value) {
            m.Online = false;
          }
          for (const m of marker.value) {
            m.Online = false;
          }

          for (const l of laser.value) {
            l.Online = false;
          }

          message.value =
            "【" + moment().format("YYYY-MM-DD HH:mm:ss") + "】" + error.Msg;
          if (error.Code === ErrorCode.NoPermission) {
            //没有权限，关闭定时器
            clearInterval(timer.value);
            ElMessage.error(error.Msg);
          }
        });
    };

    const handleWMS = (device: DeviceGroup | undefined | null) => {
      if (device === undefined) return;
      if (device === null) return;
      if (device.DeviceName === undefined) return;
      if (device.DeviceName === null) return;
      router.push({
        name: "WMSMonitor",
        params: {
          value: device.DeviceID,
          label: device.DeviceName,
        },
      });
    };
    const handleSXL = (device: DeviceGroup | undefined | null) => {
      if (device === undefined) return;
      if (device === null) return;
      if (device.DeviceName === undefined) return;
      if (device.DeviceName === null) return;
      router.push({
        name: "SXLMonitor",
        params: {
          value: device.DeviceID,
          label: device.DeviceName,
        },
      });
    };
    const handleMarker = (device: DeviceGroup | undefined | null) => {
      if (device === undefined) return;
      if (device === null) return;
      if (device.DeviceName === undefined) return;
      if (device.DeviceName === null) return;
      router.push({
        name: "MarkerMonitor",
        params: {
          value: device.DeviceID,
          label: device.DeviceName,
        },
      });
    };
    const handleLaser = (device: DeviceGroup | undefined | null) => {
      if (device === undefined) return;
      if (device === null) return;
      if (device.DeviceName === undefined) return;
      if (device.DeviceName === null) return;
      router.push({
        name: "LaserMonitor",
        params: {
          value: device.DeviceID,
          label: device.DeviceName,
        },
      });
    };
    return {
      wms,
      sxl,
      marker,
      laser,
      message,
      handleWMS,
      handleSXL,
      handleMarker,
      handleLaser,
      alarmArrStr,
      isAlarm,
      DeliveryStatusStr,
      DeliveryWorkingStr,
      DeviceModeStr,
      numberFormat,
    };
  },
});
</script>
