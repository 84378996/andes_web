<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <!-- <el-form :inline="true" v-show="false">
        <el-form-item label="设备名称">
          <el-select v-model="sxl.DeviceID" placeholder="请选择">
            <el-option
              :label="DeviceSXLStr(EDeviceSXL.DeviceSXL_1)"
              :value="EDeviceSXL.DeviceSXL_1"
            />
            <el-option
              :label="DeviceSXLStr(EDeviceSXL.DeviceSXL_2)"
              :value="EDeviceSXL.DeviceSXL_2"
            />
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
          <el-text type="primary"> {{ sxl.DeviceName }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="联机状态" :span="2">
          <el-space v-if="sxl.Online === true">
            <el-tag type="success" effect="dark">在线</el-tag>
            <el-tag
              v-if="isAlarm(sxl.DeliveryData?.Errors) === true"
              type="danger"
              effect="dark"
              >报警</el-tag
            >
          </el-space>
          <el-tag v-else type="info" effect="dark">离线</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备状态" :span="2">
          <div v-if="sxl.Online">
            <el-text>
              {{ DeliveryStatusStr(sxl.DeliveryData?.DeviceStatus) }}</el-text
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="设备模式" :span="2">
          <div v-if="sxl.Online">
            <el-text
              >{{ DeviceModeStr(sxl.DeliveryData?.DeviceMode) }}
            </el-text>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="任务状态" :span="2">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.TaskStatus === 1"> 执行中</el-text>
            <el-text v-else> 未执行</el-text>
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="时间" :span="2">
          <div v-if="sxl.Online">
            <el-text>
              {{ dateTimeFormat(sxl.DeliveryData?.CreateTime) }}</el-text
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="1号取料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DeviceGetWorkZone1 === 1">
              取料中</el-text
            >
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="1号上料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DeviceLoading1 === 1">
              上料中</el-text
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="1号下料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DeviceUnLoading1 === 1">
              下料中</el-text
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="1号卸料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DevicePutWork1 === 1">
              卸料中</el-text
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="2号取料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DeviceGetWorkZone2 === 1">
              取料中</el-text
            >
          </div>
        </el-descriptions-item>

        <el-descriptions-item label="2号上料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DeviceLoading2 === 1">
              上料中</el-text
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="2号下料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DeviceUnLoading2 === 1">
              下料中</el-text
            >
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="2号卸料">
          <div v-if="sxl.Online">
            <el-text v-if="sxl.DeliveryData?.DevicePutWork2 === 1">
              卸料中</el-text
            >
          </div>
        </el-descriptions-item>
      </el-descriptions>

      <div class="space-height-10"></div>
      <div class="container-space-between">
        <el-text tag="b">报警信息</el-text>
        <span></span>
      </div>
      <div class="el-table-border">
        <el-table
          ref="table"
          :data="sxl.DeliveryData?.Errors"
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
  apiGetDelivery,
  DeliveryStatusStr,
  DeviceModeStr,
} from "@/api/devreal";
import { useStore } from "vuex";
import { isAlarm } from "@/api/devalarm";
import { useRoute } from "vue-router";
import { dateTimeFormat, currentDateTime } from "@/api/format";
import { apiGetDisplayCycleTime } from "@/api/datadic";
import { ElMessage } from "element-plus";
import { ErrorCode } from "@/api/log";
export default defineComponent({
  name: "SXLMonitor",

  setup() {
    const store = useStore();
    const sxl = ref<DeviceGroup>({
      DeviceID: 0,
      Online: false,
      DeliveryData: null,
    });
    const cycleTime = ref(5);
    const route = useRoute();
    const timer = ref(0);
    const message = ref("");
    onMounted(() => {
      // if (route.params.devid !== undefined) {
      //   const val = Array.isArray(route.params.value)
      //     ? route.params.value[0]
      //     : route.params.value;
      //   sxl.value.DeviceID = parseInt(val);
      // }
      if (route.params.value !== undefined) {
        const val = Array.isArray(route.params.value)
          ? route.params.value[0]
          : route.params.value;
        sxl.value.DeviceID = parseInt(val);
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
      apiGetDelivery({
        Data: { DevID: sxl.value.DeviceID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          sxl.value = response.Data;
          message.value = "";
        })
        .catch((error) => {
          sxl.value.Online = false;
          message.value = "【" + currentDateTime() + "】" + error.Msg;
          if (error.Code === ErrorCode.NoPermission) {
            //没有权限，关闭定时器
            clearInterval(timer.value);
            ElMessage.error(error.Msg);
          }
        });
    };

    return {
      sxl,
      message,
      isAlarm,
      refreshData,
      DeliveryStatusStr,
      dateTimeFormat,
      DeviceModeStr,
    };
  },
});
</script>
