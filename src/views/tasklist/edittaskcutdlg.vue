<template>
  <el-dialog
    v-model="innerVisible"
    title="编辑任务文件信息"
    :width="600"
    :before-close="dlgClose"
    center
    destroy-on-close
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="文件名" prop="TaskName">
        <el-input v-model="ruleForm.TaskName" disabled></el-input>
      </el-form-item>
      <el-form-item label="路径" prop="Path">
        <el-input v-model="ruleForm.Path" disabled></el-input>
      </el-form-item>
      <el-form-item label="材料" prop="Material">
        <el-select v-model="ruleForm.Material" disabled>
          <el-option label="碳钢" value="碳钢" />
        </el-select>
      </el-form-item>
      <el-form-item label="数量" prop="TotalCount">
        <el-input v-model="ruleForm.TotalCount"></el-input>
      </el-form-item>
      <el-form-item label="长" prop="Length">
        <el-input v-model="ruleForm.Length" disabled
          ><template #append>mm</template></el-input
        >
      </el-form-item>
      <el-form-item label="宽" prop="Width">
        <el-input v-model="ruleForm.Width" disabled
          ><template #append>mm</template></el-input
        >
      </el-form-item>
      <el-form-item label="厚" prop="Thickness">
        <el-input v-model="ruleForm.Thickness" disabled
          ><template #append>mm</template></el-input
        >
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
          :loading="loading"
          style="width: 100px"
        >
          保存
        </el-button>
        <el-button @click="dlgClose" style="width: 100px">关闭</el-button>
      </el-form-item>
    </el-form>

    <el-alert
      v-if="errorMsg"
      :title="errorMsg"
      type="error"
      show-icon
      :closable="false"
    />
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import { apiModifyTaskCut, TaskCut } from "@/api/task";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "TaskCutEditDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => TaskCut,
      default: () => {
        return {};
      },
    },
  },
  emits: {
    dialogCallback: (val: DialogResult) => true,
    addCallback: (val: TaskCut) => true,
  },
  setup(props, { emit }) {
    const store = useStore();
    const loading = ref(false);
    const innerVisible = ref(false);
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive<TaskCut>({
      TaskName: "",
      Path: "",
      Material: "",
      Length: null,
      Width: null,
      Thickness: null,
      TotalCount: null,
      TaskID: 0,
    });
    const rules = reactive<FormRules<TaskCut>>({
      TaskName: [
        {
          required: true,
          message: "请输入文件名",
          trigger: "blur",
        },
      ],
      Path: [
        {
          required: true,
          message: "请输入文件路径",
          trigger: "blur",
        },
      ],
      Material: [
        {
          required: true,
          message: "请输入材料",
          trigger: "blur",
        },
      ],
      Length: [
        {
          required: true,
          trigger: "blur",
          message: "请输入钢板长",
        },
        {
          type: "number",
          message: "请输入正确的钢板长",
          trigger: "blur",
          transform: (value) => Number(value),
          validator: (rule, value) => {
            // Check if the value is a positive integer (greater than 0)
            if (isNaN(value) || value <= 0) {
              return new Error("请输入大于0的正整数");
            }
            return true;
          },
        },
      ],
      Width: [
        {
          required: true,
          trigger: "blur",
          message: "请输入钢板宽",
        },
        {
          type: "number",

          message: "请输入正确的钢板宽",
          trigger: "blur",
          transform: (value) => Number(value),
          validator: (rule, value) => {
            // Check if the value is a positive integer (greater than 0)
            if (isNaN(value) || value <= 0) {
              return new Error("请输入正确的数字");
            }
            return true;
          },
        },
      ],
      Thickness: [
        {
          required: true,
          trigger: "blur",
          message: "请输入钢板厚度",
        },
        {
          type: "number",
          message: "请输入正确的钢板厚度",
          trigger: "blur",
          transform: (value) => Number(value),
          validator: (rule, value) => {
            // Check if the value is a positive number (greater than 0)
            if (isNaN(value) || value <= 0) {
              return new Error("请输入大于0的数字");
            }
            return true;
          },
        },
      ],
      TotalCount: [
        {
          required: true,
          message: "请输入钢板数量",
          trigger: "blur",
        },
        {
          type: "number",
          message: "请输入正确的钢板数量",
          trigger: "blur",
          transform: (value) => Number(value),
          validator: (rule, value) => {
            // Check if the value is a positive integer (greater than 0)
            if (!Number.isInteger(value) || value <= 0) {
              return new Error("请输入正确的钢板数量");
            }
            return true;
          },
        },
      ],
    });

    const errorMsg = ref("");
    const searchName = ref("");
    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;

        if (newValue === true) {
          Object.assign(ruleForm, props.param);
        }
      }
    );
    //onMounted(() => {});

    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };

    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          //const data = ref({ ...ruleForm });
          //emit("addCallback", data.value);
          errorMsg.value = "";
          apiModifyTaskCut({
            Data: ruleForm,
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;
              ElMessage.info("修改成功");
              dlgClose();
            })
            .catch((error) => {
              loading.value = false;
              errorMsg.value = error.Msg;
              //ElMessage.error(error.Msg);
            });
        }
      });
    };

    return {
      loading,
      innerVisible,
      searchName,
      ruleFormRef,
      ruleForm,
      rules,
      errorMsg,
      dlgClose,
      submitForm,
    };
  },
});
</script>
<style lang="scss" scoped></style>
