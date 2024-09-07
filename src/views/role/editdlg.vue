<template>
  <el-dialog
    v-model="innerVisible"
    :title="dialogTitle"
    :width="800"
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
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色名称" prop="RoleName">
            <el-input
              v-model="ruleForm.RoleName"
              :disabled="isAdd === false"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态">
            <el-switch
              v-model="ruleForm.Enabled"
              :active-value="1"
              :inactive-value="0"
              :disabled="isAdd"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注说明">
        <el-input v-model="ruleForm.Remark"></el-input>
      </el-form-item>
      <el-form-item label="角色权限">
        <div style="height: 420px; width: 100%" class="tree-border">
          <el-scrollbar>
            <el-tree
              ref="treeRef"
              :data="purviewTree"
              show-checkbox
              node-key="Value"
              highlight-current
              :props="treeProps"
            >
              <template #default="{ node }">
                <el-text>{{ node.label }}</el-text>
              </template>
            </el-tree>
          </el-scrollbar>
        </div></el-form-item
      >
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
import {
  defineComponent,
  reactive,
  ref,
  watch,
  onMounted,
  nextTick,
} from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import {
  Purview,
  apiGetRole,
  apiModifyRole,
  apiAddRole,
  RoleInfo,
  RoleCondition,
  apiGetPurviewOptions,
  resetRoleInfo,
} from "@/api/role";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
export default defineComponent({
  name: "RoleEditDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => RoleCondition,
      default: () => {
        return { ID: 0 };
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
    const ruleFormRef = ref<FormInstance>();
    const dialogTitle = ref("编辑角色信息");
    const isAdd = ref(false);
    const ruleForm = reactive<RoleInfo>({});
    const treeRef = ref<InstanceType<typeof ElTree>>();
    const purviewTree = ref<Purview[]>([]);
    const rules = reactive<FormRules<RoleInfo>>({
      RoleName: [
        {
          type: "string",
          required: true,
          message: "请输入角色名称",
          trigger: "blur",
        },
      ],
    });

    const treeProps = {
      children: "Children",
      label: "Label",
    };

    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        resetRoleInfo(ruleForm);
        if (newValue === true) init();
      }
    );

    onMounted(() => {
      getPurviews();
    });

    const getPurviews = () => {
      loading.value = true;
      apiGetPurviewOptions({
        Data: {},
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          console.log(response);
          purviewTree.value = response.Data?.Data;
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

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
      dialogTitle.value = "添加角色信息";
      ruleForm.ID = 0;
      ruleForm.Enabled = 1;
      isAdd.value = true;
    };
    const initEdit = () => {
      dialogTitle.value = "编辑角色信息";
      ruleForm.ID = props.param.ID;
      isAdd.value = false;
      loading.value = true;

      apiGetRole({
        Data: { ID: ruleForm.ID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          Object.assign(ruleForm, response.Data?.RoleInfo);

          //权限
          treeRef.value?.setCheckedKeys(
            response.Data?.RoleInfo.PurviewList,
            false
          );
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
          if (isAdd.value) addRole();
          else modifyRole();
        }
      });
    };

    const addRole = () => {
      if (treeRef.value === undefined) {
        ElMessage.error("请稍后重试");
        return;
      }
      ruleForm.PurviewList = treeRef.value?.getCheckedKeys(true).map(String);
      loading.value = true;
      apiAddRole({
        Data: { RoleInfo: ruleForm },
        OperID: store.getters.user.ID,
      })
        .then(() => {
          loading.value = false;
          ElMessage.success("添加成功");

          emit("dialogCallback", { show: false, refresh: true });
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    const modifyRole = () => {
      loading.value = true;
      if (treeRef.value === undefined) {
        ElMessage.error("请稍后重试");
        return;
      }
      ruleForm.PurviewList = treeRef.value?.getCheckedKeys(true).map(String);
      apiModifyRole({
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

    return {
      loading,
      innerVisible,
      dialogTitle,
      isAdd,
      treeProps,
      purviewTree,
      dlgClose,
      submitForm,

      ruleFormRef,
      ruleForm,
      rules,
      treeRef,
    };
  },
});
</script>
<style lang="scss" scoped></style>
