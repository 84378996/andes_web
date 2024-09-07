<template>
  <div class="dialog-container">
    <el-dialog
      v-model="innerVisible"
      :title="title"
      :width="1200"
      :before-close="dlgClose"
      center
      destroy-on-close
    >
      <el-table
        ref="table"
        class="el-table-with-tool"
        :data="task && task.TaskCuts"
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
        <el-table-column label="操作" width="80px">
          <template v-slot="scope">
            <el-button
              class="el-table-button"
              type="primary"
              plain
              @click="handleSendFile(scope.row)"
            >
              发送
            </el-button>
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
          label="材料"
          prop="Material"
          width="120x"
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

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dlgClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { useStore } from "vuex";
import { TaskCutList, apiSendCutFile } from "@/api/task";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "TaskSendFileDlg",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    taskCutList: {
      type: Object as () => TaskCutList | null,
      default: () => {
        return null;
      },
    },
  },
  emits: {
    dialogCallback: (val: DialogResult) => true,
  },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const innerVisible = ref(false);
    const title = ref("发送切割文件");

    const task = ref<TaskCutList | null>({});

    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        task.value = props.taskCutList;
        console.log("task.value");
        console.log(task.value);
      }
    );

    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };

    const handleSendFile = (row: any) => {
      loading.value = true;
      var param = {
        TaskCutID: row.ID,
        TaskLine: task.value?.TaskLine,
      };
      console.log(param);
      apiSendCutFile({
        Data: param,
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          ElMessage.success("发送成功");
          emit("dialogCallback", { show: false, refresh: true });
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    return {
      loading,
      innerVisible,
      title,
      dlgClose,
      task,
      handleSendFile,
    };
  },
});
</script>
<style lang="scss" scoped></style>
