<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
          <el-form-item label="记录时间">
            <el-date-picker
              v-model="ruleForm.StartTime"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY年MM月DD日"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="-">
            <el-date-picker
              v-model="ruleForm.EndTime"
              type="date"
              value-format="YYYY-MM-DD"
              format="YYYY年MM月DD日"
            >
            </el-date-picker>
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
        <el-table-column label="设备" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.DevName }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="记录时间" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ dateTimeFormat(scope.row.StartTime) }}</el-text>
          </template>
        </el-table-column>
        <el-table-column label="报警编号" show-overflow-tooltip>
          <template v-slot="scope">
            <el-text>{{ scope.row.AlarmID }}</el-text>
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
import { defineComponent, ref, reactive } from "vue";
import { AlarmCondition, apiGetAlarms } from "@/api/devalarm";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import { dateTimeFormat } from "@/api/format";
import {
  getColumnWidth,
  getRowIndex,
  columnOperateWidth,
  columnSelectionWidth,
} from "@/api/common";

export default defineComponent({
  name: "AlarmLog",
  props: {
    msg: String,
  },
  setup() {
    const loading = ref(false);
    const isDetailDlgVisible = ref(false);
    const list = ref([]);
    const store = useStore();
    const columnIndexWidth = ref(50);
    const ruleForm = reactive<AlarmCondition>({
      PageIndex: 1,
      PageSize: 15,
      StartTime: null,
      EndTime: null,
    });
    const query = ref<AlarmCondition>({});
    const total = ref(0);

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
      apiGetAlarms({
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
    };
    const getSelectable = (row: any, index: number) => {
      return false;
    };
    return {
      loading,
      list,
      query,
      total,
      ruleForm,
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
