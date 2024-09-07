<template>
  <el-dialog
    v-model="innervisible"
    title="任务信息"
    :width="1000"
    destroy-on-close
    center
    :before-close="dlgClose"
  >
    <el-tabs type="border-card" v-model="activeTab">
      <el-tab-pane label="详细信息" name="1">
        <el-descriptions v-if="activeTab == '1'" :column="2" border>
          <el-descriptions-item label="任务列表">
            <el-text>{{ dataItem.TaskLineName }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="任务号">
            <el-text>{{ dataItem.TaskNo }}</el-text>
          </el-descriptions-item>

          <el-descriptions-item label="状态">
            <el-text :type="TaskListStatusType(dataItem.Status)">{{
              TaskListStatusStr(dataItem.Status)
            }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="文件数">
            <el-text>{{ dataItem.TaskCutCount }}</el-text>
          </el-descriptions-item>

          <el-descriptions-item label="完成钢板数">
            <el-text>{{ dataItem.FinishCount }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="总钢板数">
            <el-text>{{ dataItem.TotalCount }}</el-text>
          </el-descriptions-item>

          <el-descriptions-item label="上料钢板数">
            <el-text>{{ dataItem.FeedCount }}</el-text>
          </el-descriptions-item>

          <el-descriptions-item label="录入时间">
            <el-text>{{ dateTimeFormat(dataItem.AddTime) }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="任务开始时间">
            <el-text>{{ dateTimeFormat(dataItem.StartTime) }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="任务结束时间">
            <el-text>{{ dateTimeFormat(dataItem.FinishTime) }}</el-text>
          </el-descriptions-item>
          <el-descriptions-item label="说明" :span="2">
            <el-text>{{ dataItem.Remark }}</el-text>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="文件列表" name="2">
        <el-table
          ref="table"
          :data="dataItem.TaskCuts"
          stripe
          border
          highlight-current-row
          v-loading="loading"
        >
          <el-table-column label="顺序" show-overflow-tooltip width="70px">
            <template v-slot="scope">
              {{ scope.row.Sort }}
            </template>
          </el-table-column>

          <el-table-column
            label="文件名"
            prop="TaskName"
            min-width="120x"
            show-overflow-tooltip
          />
          <el-table-column
            label="数量"
            width="70px"
            prop="TotalCount"
            show-overflow-tooltip
          />
          <el-table-column
            label="长(mm)"
            width="90px"
            prop="Length"
            show-overflow-tooltip
          />
          <el-table-column
            label="宽(mm)"
            width="90px"
            prop="Width"
            show-overflow-tooltip
          />
          <el-table-column
            label="板厚(mm)"
            width="100px"
            prop="Thickness"
            show-overflow-tooltip
          />
          <el-table-column label="路径" prop="Path" show-overflow-tooltip />
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="日志" name="3">
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
import {
  TaskListCondition,
  TaskCutList,
  resetTaskCutList,
  apiGetTask,
  TaskListStatusStr,
  TaskListStatusType,
} from "@/api/task";
import { DialogResult } from "@/api/interface";
import { dateTimeFormat } from "@/api/format";
import ModifyLogList from "@/views/log/modifylist.vue";
export default defineComponent({
  name: "TaskDetailDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => TaskListCondition,
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
    const activeTab = ref("1");
    const dataItem = ref<TaskCutList>({});
    const logList = ref([]);
    watch(
      () => props.visible,
      (newValue) => {
        innervisible.value = newValue;
        resetTaskCutList(dataItem.value);
        if (newValue === true) init();
      }
    );

    const init = () => {
      loading.value = true;
      activeTab.value = "1";

      apiGetTask({
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
      TaskListStatusStr,
      TaskListStatusType,
    };
  },
});
</script>
<style lang="scss" scoped></style>
