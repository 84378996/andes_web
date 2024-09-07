<template>
  <div>
    <el-table ref="table" :data="logList" stripe highlight-current-row>
      <el-table-column label="#" width="70px" align="center">
        <template v-slot="scope">
          <el-text> {{ scope.$index + 1 }}</el-text>
        </template>
      </el-table-column>
      <!-- <el-table-column type="expand" label="修改前" width="70px">
              <template #default="props">
                <contract-detail
                  size="mini"
                  :item="getlogdata(props.row)"
                ></contract-detail>
              </template>
            </el-table-column> -->
      <el-table-column label="时间" width="200px" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ dateTimeFormat(scope.row.AddTime) }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="标题" min-width="100px" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.Title }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="日志类型" min-width="60px" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.TypeStr }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="操作员" min-width="60px" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.OperName }}</el-text>
        </template>
      </el-table-column>
      <el-table-column label="说明" show-overflow-tooltip>
        <template v-slot="scope">
          <el-text>{{ scope.row.Remark }}</el-text>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { dateTimeFormat } from "@/api/format";

export default defineComponent({
  name: "ModifyLogList",
  props: {
    logList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  setup() {
    return {
      dateTimeFormat,
    };
  },
});
</script>
<style lang="scss" scoped></style>
