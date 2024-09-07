<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <!-- <el-form :inline="true" v-show="false">
        <el-form-item label="设备名称">
          <el-select v-model="laser.DeviceID" placeholder="请选择">
            <el-option
              :label="DeviceLaserStr(EDeviceLaser.DevLaser1_1)"
              :value="EDeviceLaser.DevLaser1_1"
            />
            <el-option
              :label="DeviceLaserStr(EDeviceLaser.DevLaser1_2)"
              :value="EDeviceLaser.DevLaser1_2"
            />
            <el-option
              :label="DeviceLaserStr(EDeviceLaser.DevLaser2_1)"
              :value="EDeviceLaser.DevLaser2_1"
            />
            <el-option
              :label="DeviceLaserStr(EDeviceLaser.DevLaser2_2)"
              :value="EDeviceLaser.DevLaser2_2"
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
          <el-text type="primary"> {{ laser.DeviceName }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="联机状态" :span="2">
          <el-space v-if="laser.Online === true">
            <el-tag type="success" effect="dark">在线</el-tag>
            <el-tag
              v-if="isAlarm(laser.LaserData?.Errors) === true"
              type="danger"
              effect="dark"
              >报警</el-tag
            >
          </el-space>
          <el-tag v-else type="info" effect="dark">离线</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="设备状态" :span="2">
          <div v-if="laser.Online">
            <el-text> {{ laser.LaserData?.DevStatus }}</el-text>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="设备模式" :span="2">
          <el-text v-if="laser.Online">{{
            DeviceModeStr(laser.LaserData?.DevMode)
          }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="切割文件" :span="2">
          <el-text v-if="laser.Online"> {{ laser.LaserData?.CutProg }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="材料">
          <el-text v-if="laser.Online">
            {{ laser.LaserData?.Material }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="钢板厚">
          <el-text v-if="laser.Online">
            {{ numberFormat(laser.LaserData?.Thick, 2) }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="切割长度">
          <el-text v-if="laser.Online">
            {{ numberFormat(laser.LaserData?.CutLength, 2) }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="切割时间">
          <el-text v-if="laser.Online"> {{ laser.LaserData?.CutTime }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item label="钢板长">
          <el-text v-if="laser.Online">
            {{ numberFormat(laser.LaserData?.Length, 2) }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="钢板宽">
          <el-text v-if="laser.Online">
            {{ numberFormat(laser.LaserData?.Width, 2) }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="X坐标值">
          <el-text v-if="laser.Online">
            {{ numberFormat(laser.LaserData?.MachineX, 3) }}</el-text
          >
        </el-descriptions-item>
        <el-descriptions-item label="Y坐标值">
          <el-text v-if="laser.Online">
            {{ numberFormat(laser.LaserData?.MachineY, 3) }}</el-text
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
        :data="laser.LaserData?.Errors"
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
import { DeviceGroup, apiGetLaser, DeviceModeStr } from "@/api/devreal";
import { isAlarm } from "@/api/devalarm";
import { useRoute } from "vue-router";
import { dateTimeFormat, currentDateTime, numberFormat } from "@/api/format";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { apiGetDisplayCycleTime } from "@/api/datadic";
import { ErrorCode } from "@/api/log";
export default defineComponent({
  name: "LaserMonitor",
  props: {
    propName: String,
  },
  setup() {
    const laser = ref<DeviceGroup>({
      DeviceID: 0,
      Online: false,
      LaserData: null,
    });

    const store = useStore();
    const route = useRoute();
    const message = ref("");
    const cycleTime = ref(5);
    const timer = ref(0);

    onMounted(() => {
      // if (route.params.value !== undefined) {
      //   const val = Array.isArray(route.params.value)
      //     ? route.params.value[0]
      //     : route.params.value;
      //   laser.value.DeviceID = parseInt(val);
      // }
      if (route.params.value !== undefined) {
        const val = Array.isArray(route.params.value)
          ? route.params.value[0]
          : route.params.value;
        laser.value.DeviceID = parseInt(val);
      } else {
        console.log("route.params.value is udefined");
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
      apiGetLaser({
        Data: { DevID: laser.value.DeviceID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          laser.value = response.Data;
          console.log(response);
          message.value = "";
        })
        .catch((error) => {
          laser.value.Online = false;
          message.value = "【" + currentDateTime() + "】" + error.Msg;
          if (error.Code === ErrorCode.NoPermission) {
            //没有权限，关闭定时器
            clearInterval(timer.value);
            ElMessage.error(error.Msg);
          }
        });
    };
    return {
      laser,
      message,
      isAlarm,
      dateTimeFormat,
      DeviceModeStr,
      numberFormat,
    };
  },
});
</script>
