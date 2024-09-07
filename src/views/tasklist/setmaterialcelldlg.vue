<template>
  <el-dialog
    v-model="innervisible"
    title="成品下料信息"
    :width="600"
    destroy-on-close
    center
    :before-close="dlgClose"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="任务号">
        <el-input disabled v-model="ruleForm.TaskLineName"></el-input>
      </el-form-item>

      <el-form-item label="材料" prop="material">
        <el-input v-model="ruleForm.material"></el-input>
      </el-form-item>
      <el-form-item label="长" prop="length">
        <el-input v-model="ruleForm.length"
          ><template #append>mm</template></el-input
        >
      </el-form-item>
      <el-form-item label="宽" prop="width">
        <el-input v-model="ruleForm.width"
          ><template #append>mm</template></el-input
        >
      </el-form-item>
      <el-form-item label="厚" prop="thickness">
        <el-input v-model="ruleForm.thickness"
          ><template #append>mm</template></el-input
        >
      </el-form-item>
      <el-form-item label="数量" prop="num">
        <el-input v-model="ruleForm.num"></el-input>
      </el-form-item>
      <el-form-item label="托盘是否存在" prop="IsMaterialOutDone">
        <el-checkbox
          label="存在"
          v-model="ruleForm.IsMaterialOutDone"
        ></el-checkbox>
      </el-form-item>
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
import { defineComponent, ref, watch, reactive } from "vue";
import { useStore } from "vuex";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  TaskGroup,
  TaskListStatusStr,
  TaskListStatusType,
  apiSetMaterialCell,
} from "@/api/task";
import { WMSCell } from "@/api/devreal";
import { DialogResult } from "@/api/interface";
import { dateTimeFormat } from "@/api/format";
export default defineComponent({
  name: "SetMaterialcellDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => TaskGroup,
      default: () => {
        return { ID: 0 };
      },
    },
  },
  components: {},
  emits: {
    dialogCallback: (val: DialogResult) => true,
  },
  setup(props, { emit }) {
    const store = useStore();
    const innervisible = ref(props.visible);
    const loading = ref(false);
    const activeTab = ref("1");
    const logList = ref([]);
    const ruleFormRef = ref<FormInstance>();
    const ruleForm = reactive({
      TaskLine: 0,
      TaskLineName: "",
      material: "",
      length: "",
      width: "",
      thickness: "",
      num: 0,
      IsMaterialOutDone: false,
    });
    const rules = reactive<FormRules>({
      material: [
        {
          required: true,
          message: "请输入材料",
          trigger: "blur",
        },
      ],
      length: [
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
            if (isNaN(value) || value < 0) {
              return new Error("请输入正确的钢板长(>=0)");
            }
            return true;
          },
        },
      ],
      width: [
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
            if (isNaN(value) || value < 0) {
              return new Error("请输入正确的钢板宽(>=0)");
            }
            return true;
          },
        },
      ],
      thickness: [
        {
          required: true,
          trigger: "blur",
          message: "请输入钢板厚度",
        },
        {
          type: "number",
          message: "请输入正确的钢板厚",
          trigger: "blur",
          transform: (value) => Number(value),
          validator: (rule, value) => {
            // Check if the value is a positive number (greater than 0)
            if (isNaN(value) || value < 0) {
              return new Error("请输入正确的钢板厚(>=0)");
            }
            return true;
          },
        },
      ],
      num: [
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
            if (!Number.isInteger(value) || value < 0) {
              return new Error("请输入正确的钢板数量(>=0)");
            }
            return true;
          },
        },
      ],
    });
    watch(
      () => props.visible,
      (newValue) => {
        innervisible.value = newValue;
        if (newValue === true) init();
      }
    );

    const init = () => {
      ruleForm.TaskLine = props.param.TaskLine || 0;
      ruleForm.TaskLineName = props.param.TaskLineName || "";

      if (props.param.MaterialOutCell) {
        ruleForm.material = props.param.MaterialOutCell.material || "";
        ruleForm.length = props.param.MaterialOutCell.length || "";
        ruleForm.width = props.param.MaterialOutCell.width || "";
        ruleForm.thickness = props.param.MaterialOutCell.thickness || "";
        ruleForm.num = props.param.MaterialOutCell.num || 0;
        ruleForm.IsMaterialOutDone = props.param.IsMaterialOutDone || false;
      }

      return;
    };
    const modify = () => {
      loading.value = true;
      apiSetMaterialCell({
        Data: ruleForm,
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          ElMessage.success("设置成功");

          emit("dialogCallback", { show: false, refresh: true });
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          modify();
        }
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
      ruleFormRef,
      logList,
      ruleForm,
      rules,
      dlgClose,
      dateTimeFormat,
      TaskListStatusStr,
      TaskListStatusType,
      apiSetMaterialCell,
      submitForm,
    };
  },
});
</script>
<style lang="scss" scoped></style>
