<template>
  <el-dialog
    v-model="innerVisible"
    title="修改密码"
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
      <el-form-item label="登录名" prop="LoginName">
        <el-input v-model="ruleForm.LoginName" disabled></el-input>
      </el-form-item>

      <el-form-item label="用户姓名" prop="UserName">
        <el-input v-model="ruleForm.UserName" disabled></el-input>
      </el-form-item>

      <el-form-item label="新密码" prop="Pwd1">
        <el-input
          type="password"
          v-model="ruleForm.Pwd1"
          show-password
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="Pwd2">
        <el-input
          type="password"
          v-model="ruleForm.Pwd2"
          show-password
          autocomplete="off"
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
import { defineComponent, reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import { apiGetUser, apiModifyUser, UserInfo, UserCondition } from "@/api/user";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "UserEditPwdDlg",
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

    const ruleForm = reactive({
      ID: 0,
      LoginName: "",
      UserName: "",
      Pwd1: "",
      Pwd2: "",
    });
    const validatePass2 = (rule: any, value: any, callback: any) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (value !== ruleForm.Pwd1) {
        callback(new Error("两次输入的密码不一致!"));
      } else {
        callback();
      }
    };
    const rules = reactive<FormRules>({
      Pwd1: [
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
      Pwd2: [
        {
          validator: validatePass2,
          trigger: "blur",
        },
      ],
    });

    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        if (newValue === true) init();
      }
    );
    const resetRuleForm = () => {
      ruleForm.ID = 0;
      ruleForm.LoginName = "";
      ruleForm.UserName = "";
      ruleForm.Pwd1 = "";
      ruleForm.Pwd2 = "";
    };

    const init = () => {
      resetRuleForm();
      if (ruleFormRef.value != null) ruleFormRef.value.resetFields();

      if (
        props.param.ID !== undefined &&
        props.param.ID !== null &&
        props.param.ID > 0
      ) {
        ruleForm.ID = props.param.ID;
      }
      loading.value = true;
      console.log(ruleForm);
      apiGetUser({
        Data: { ID: ruleForm.ID },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          var userinfo = response.Data?.User;
          if (userinfo === undefined) return;
          ruleForm.ID = userinfo.ID;
          ruleForm.UserName = userinfo.UserName;
          ruleForm.LoginName = userinfo.LoginName;
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
          modifyUser();
        }
      });
    };

    const modifyUser = () => {
      loading.value = true;
      apiModifyUser({
        Data: { ID: ruleForm.ID, Pwd: ruleForm.Pwd1 },
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
