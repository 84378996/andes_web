<template>
  <el-dialog
    v-model="innerVisible"
    :title="dialogTitle"
    :width="600"
    :before-close="dlgClose"
    center
    destroy-on-close
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="任务" prop="TaskLine">
        <el-select v-model="ruleForm.TaskLine" :disabled="isAdd === false">
          <el-option
            v-for="item in taskLineOptions"
            :key="item.Key"
            :label="item.Value"
            :value="item.Key"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="任务号">
        <el-input disabled v-model="ruleForm.TaskNo"></el-input>
      </el-form-item>

      <el-form-item label="备注" prop="Remark">
        <el-input v-model="ruleForm.Remark" :rows="2" type="textarea"></el-input
      ></el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          :loading="loading"
        >
          提 交
        </el-button>
        <el-button @click="dlgClose"> 取 消 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import {
  apiAddTask,
  apiGetTask,
  TaskCutList,
  apiModifyTask,
  resetTaskCutList,
  apiGetTaskLineOptions,
} from "@/api/task";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";
import { KeyValuePair } from "@/api/interface";

export default defineComponent({
  name: "TaskEditDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => TaskCutList,
      default: () => {
        return {};
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
    const dialogTitle = ref("任务信息");
    const isAdd = ref(false);
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive<TaskCutList>({
      ID: 0,
      TaskLine: 0,
    });
    const rules = reactive<FormRules<TaskCutList>>({
      TaskLine: [
        {
          required: true,
          message: "请选择任务",
          trigger: "blur",
        },
      ],
    });
    const taskLineOptions = ref<KeyValuePair[]>([]);
    onMounted(() => {
      getTaskLineOptions();
    });
    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        resetTaskCutList(ruleForm);
        ruleForm.ID = props.param.ID;
        console.log(ruleForm);
        if (newValue) init();
      }
    );
    const init = () => {
      if (ruleFormRef.value != null) ruleFormRef.value.resetFields();
      if (
        props.param.ID !== undefined &&
        props.param.ID !== null &&
        props.param.ID > 0
      )
        initEdit();
      else initAdd();
    };

    const initAdd = () => {
      dialogTitle.value = "添加任务信息";
      ruleForm.ID = 0;
      isAdd.value = true;
    };
    const initEdit = () => {
      dialogTitle.value = "编辑任务信息";
      ruleForm.ID = props.param.ID;
      isAdd.value = false;
      loading.value = true;

      apiGetTask({
        Data: { ID: ruleForm.ID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          Object.assign(ruleForm, response.Data?.Data);
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

    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          if (isAdd.value) addTask();
          else modifyTask();
        }
      });
    };

    const addTask = () => {
      loading.value = true;
      apiAddTask({
        Data: ruleForm,
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          ElMessage.success("提交成功");

          emit("dialogCallback", { show: false, refresh: true });
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };
    const modifyTask = () => {
      loading.value = true;
      apiModifyTask({
        Data: ruleForm,
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          ElMessage.success("提交成功");

          emit("dialogCallback", { show: false, refresh: true });
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
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
      innerVisible,
      dialogTitle,
      taskLineOptions,
      apiGetTaskLineOptions,
      dlgClose,
      submitForm,
      ruleFormRef,
      ruleForm,
      rules,
      isAdd,
    };
  },
});
</script>
<style lang="scss" scoped></style>
