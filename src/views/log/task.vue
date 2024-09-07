<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
          <el-form-item label="记录时间">
            <el-date-picker
              v-model="ruleForm.StartTime"
              value-format="YYYY-MM-DD"
              format="YYYY年MM月DD日"
              type="date"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker
              v-model="ruleForm.EndTime"
              value-format="YYYY-MM-DD"
              format="YYYY年MM月DD日"
              type="date"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="任务" prop="TaskLine">
            <el-select v-model="ruleForm.TaskLine" clearable>
              <el-option
                v-for="item in taskLineOptions"
                :key="item.Key"
                :label="item.Value"
                :value="item.Key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="任务号" prop="TaskNo">
            <el-input v-model="ruleForm.TaskNo"></el-input>
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
    </el-header>
    <el-main class="main-container container-border">
      <el-table
        ref="table"
        class="el-table-with-tool"
        v-loading="loading"
        :data="list"
        stripe
        highlight-current-row
      >
        <el-table-column
          type="selection"
          :selectable="getSelectable"
          :width="columnSelectionWidth"
        />
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
        <el-table-column label="记录时间" width="200px" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ dateTimeFormat(scope.row.AddTime) }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="任务" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.TaskLineName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="任务号" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.TaskNo }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="Action" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.Action }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="发送" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.SendName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="接收" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.RecvName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="详细说明" show-overflow-tooltip
          ><template v-slot="scope">
            <el-text>{{ scope.row.Remark }}</el-text>
          </template>
        </el-table-column>
      </el-table>
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
import { defineComponent, ref, reactive, onMounted } from "vue";
import { TaskLogCondition, apiGetTaskLogs } from "@/api/tasklog";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { dateTimeFormat } from "@/api/format";
import { KeyValuePair } from "@/api/interface";
import { apiGetTaskLineOptions } from "@/api/task";
import {
  getColumnWidth,
  getRowIndex,
  columnOperateWidth,
  columnSelectionWidth,
} from "@/api/common";
export default defineComponent({
  name: "TaskLog",
  props: {
    msg: String,
  },
  setup() {
    const loading = ref(false);
    const isDetailDlgVisible = ref(false);
    const list = ref([]);
    const store = useStore();
    const columnIndexWidth = ref(50);
    const ruleForm = reactive<TaskLogCondition>({
      PageIndex: 1,
      PageSize: 15,
      StartTime: null,
      EndTime: null,
      TaskLine: null,
      TaskNo: null,
    });
    const query = ref<TaskLogCondition>({});
    const total = ref(0);
    const taskLineOptions = ref<KeyValuePair[]>([]);
    onMounted(() => {
      getTaskLineOptions();
    });
    const menuDetail = (row: any) => {
      //dlgParam.value = { ID: row.ID };
      isDetailDlgVisible.value = true;
    };

    const handleSizeChange = (val: number) => {
      ruleForm.PageSize = val;
      Object.assign(query.value, ruleForm);
      refresh();
    };

    const refresh = () => {
      loading.value = true;
      list.value = [];
      apiGetTaskLogs({
        Data: query.value,
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          list.value = response.Data?.Data;
          loading.value = false;
          total.value = response.Data?.Total;
          columnIndexWidth.value = getColumnWidth(query.value);
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };
    const handleCurrentChange = (val: number) => {
      ruleForm.PageIndex = val;
      Object.assign(query.value, ruleForm);
      refresh();
    };

    const handleQuery = () => {
      ruleForm.PageIndex = 1;
      Object.assign(query.value, ruleForm);
      refresh();
    };

    const handleQueryClear = () => {
      ruleForm.StartTime = null;
      ruleForm.EndTime = null;
      ruleForm.TaskLine = null;
      ruleForm.TaskNo = null;
    };
    const getSelectable = (row: any, index: number) => {
      return false;
    };
    const getTaskLineOptions = () => {
      apiGetTaskLineOptions({
        Data: {},
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          taskLineOptions.value = response.Data.Data;
        })
        .catch((error) => {
          ElMessage.error(error.Msg);
        });
    };
    return {
      loading,
      list,
      total,
      ruleForm,
      query,
      taskLineOptions,
      columnIndexWidth,
      columnSelectionWidth,
      columnOperateWidth,
      menuDetail,
      handleSizeChange,
      handleCurrentChange,
      handleQuery,
      handleQueryClear,
      dateTimeFormat,
      getRowIndex,
      getSelectable,
    };
  },
});
</script>
