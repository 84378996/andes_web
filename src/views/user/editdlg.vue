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
      <el-row
        ><el-col :span="12">
          <el-form-item label="登录名" prop="LoginName">
            <el-input
              v-model="ruleForm.LoginName"
              :disabled="isAdd === false"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="用户姓名" prop="UserName">
            <el-input v-model="ruleForm.UserName"></el-input>
          </el-form-item> </el-col
      ></el-row>
      <el-row
        ><el-col :span="12">
          <el-form-item label="设备登录名" prop="DevUser">
            <el-input v-model="ruleForm.DevUser"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="Pwd">
            <el-input
              v-model="ruleForm.Pwd"
              :disabled="isAdd === false"
              type="password"
              show-password
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row
        ><el-col :span="12">
          <el-form-item label="电话" prop="Phone">
            <el-input v-model="ruleForm.Phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱" prop="Email">
            <el-input v-model="ruleForm.Email"></el-input>
          </el-form-item> </el-col
      ></el-row>
      <el-row
        ><el-col :span="12">
          <el-form-item label="部门" prop="Department">
            <el-input v-model="ruleForm.Department"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="工号" prop="JobNumber">
            <el-input v-model="ruleForm.JobNumber"></el-input>
          </el-form-item> </el-col
      ></el-row>
      <el-row
        ><el-col :span="12">
          <el-form-item label="状态">
            <el-switch
              v-model="ruleForm.Enabled"
              :active-value="1"
              :inactive-value="0"
              :disabled="isAdd"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色">
            <el-select v-model="ruleForm.RoleID">
              <el-option
                v-for="item in roleOptions"
                :key="item.ID"
                :label="item.RoleName"
                :value="item.ID"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注说明" prop="Remark" style="margin-bottom: 0px">
        <el-input
          v-model="ruleForm.Remark"
          :autosize="{ minRows: 2, maxRows: 4 }"
          type="textarea"
        ></el-input>
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
import { defineComponent, reactive, ref, watch, onMounted } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import {
  apiGetUser,
  apiModifyUser,
  apiAddUser,
  UserInfo,
  UserCondition,
  resetUserInfo,
} from "@/api/user";
import { apiGetRoleOptions, RoleInfo } from "@/api/role";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "UserEditDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => UserCondition,
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
    const dialogTitle = ref("编辑用户信息");
    const isAdd = ref(false);
    const roleOptions = ref<RoleInfo[]>([]);
    const ruleForm = reactive<UserInfo>({});
    const rules = reactive<FormRules<UserInfo>>({
      LoginName: [
        {
          type: "string",
          required: true,
          message: "请输入登录名",
          trigger: "blur",
        },
        {
          min: 5,
          max: 20,
          message: "长度为 5 到 20 个字符",
          trigger: "blur",
        },
        {
          pattern: /^[A-Za-z0-9_]+$/, // 只允许字母、数字和下划线
          message: "只能包含字母、数字和下划线",
          trigger: "blur",
        },
      ],
      UserName: [
        {
          type: "string",
          required: true,
          message: "请输入用户姓名",
          trigger: "blur",
        },
      ],
      Pwd: [
        {
          type: "string",
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        {
          min: 5, // 最小长度要求
          message: "密码长度至少为5个字符",
          trigger: "blur",
        },
        {
          pattern: /^[\x21-\x7E]+$/, // 只包含可见ASCII字符
          message: "密码长度至少为5个字符",
          trigger: "blur",
        },
      ],
    });

    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        resetUserInfo(ruleForm);
        if (newValue === true) init();
      }
    );
    onMounted(() => {
      getRoleOptions();
      //refresh();
    });

    const getRoleOptions = () => {
      loading.value = true;
      apiGetRoleOptions({
        Data: {},
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          console.log(response);
          roleOptions.value = response.Data?.Data;
        })
        .catch((error) => {
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
      dialogTitle.value = "添加用户信息";
      ruleForm.ID = 0;
      ruleForm.Enabled = 1;
      isAdd.value = true;

      rules.Pwd = [
        {
          type: "string",
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
        {
          min: 5, // 最小长度要求
          message: "密码长度至少为5个字符",
          trigger: "blur",
        },
        {
          pattern: /^[\x21-\x7E]+$/, // 只包含可见ASCII字符
          message: "密码长度至少为5个字符",
          trigger: "blur",
        },
      ];
    };
    const initEdit = () => {
      dialogTitle.value = "编辑用户信息";
      ruleForm.ID = props.param.ID;
      isAdd.value = false;
      loading.value = true;
      rules.Pwd = [];
      apiGetUser({
        Data: { ID: ruleForm.ID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          Object.assign(ruleForm, response.Data?.User);
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
          if (isAdd.value) addUser();
          else modifyUser();
        }
      });
    };

    const addUser = () => {
      loading.value = true;
      apiAddUser({
        Data: ruleForm,
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

    const modifyUser = () => {
      loading.value = true;
      apiModifyUser({
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
      roleOptions,
      dlgClose,
      submitForm,

      ruleFormRef,
      ruleForm,
      rules,
    };
  },
});
</script>
<style lang="scss" scoped></style>
