<template>
  <div
    class="login-container"
    :style="{
      backgroundImage: 'url(' + imgbg + ')',
    }"
  >
    <el-card>
      <template #header>
        <div class="card-header">
          <span>天燃气监控系统登录</span>
        </div>
      </template>
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-position="left"
        status-icon
      >
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入登录名"
            type="text"
            tabindex="1"
            autocomplete="on"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            placeholder="请输入密码"
            tabindex="2"
            autocomplete="off"
            prefix-icon="Lock"
            show-password
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input
            v-model="ruleForm.code"
            maxlength="8"
            placeholder="请输入验证码"
            prefix-icon="Key"
            autocomplete="off"
          >
            <template #append>
              <el-image :src="codeurl" class="codeimage" @click="refreshIDCode">
                <template #error>
                  <div class="image-slot" @click="refreshIDCode">
                    <el-icon :size="24"><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-loading="loading"
            icon="Avatar"
            type="primary"
            @click="submitForm(ruleFormRef)"
            >登 录</el-button
          >
        </el-form-item>
      </el-form>
      <div class="divcopyright">
        <span>版权所有：华工法利莱切焊系统工程有限公司</span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts">
import { reactive, ref, defineComponent, onMounted, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getImagecode } from "@/api/user";
import imgbg from "@/assets/loginbg.jpg";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
//import config from "../../../package.json";
import { ElMessage } from "element-plus";
import { ResponseObject } from "@/api/interface";
export default defineComponent({
  name: "LoginIndex",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    let loading = ref<boolean>(false);
    let loadingCode = ref<boolean>(false);
    let codeurl = ref("");
    const redirect = route.query.redirect?.toString() || "";
    const ruleFormRef = ref<FormInstance>();

    // const ruleForm = reactive<UserInfo>({
    //   username: "admin",
    //   password: "313621002",
    //   code: "",
    //   codeid: "",
    // });
    let ruleForm = ref({
      username: "admin",
      password: "123456",
      code: "",
      codeid: "",
    });

    const validateUsername = (rule: any, value: string, callback: any) => {
      if (value === null || value.trim() === "") {
        callback(new Error("请输入登录名"));
      } else {
        callback(); // Pass null when validation succeeds
      }
    };

    const validatePassword = (rule: any, value: string, callback: any) => {
      if (value === null || value.trim() === "") {
        callback(new Error("请输入密码"));
      } else {
        callback(); // Pass null when validation succeeds
      }
    };
    const validateCode = (rule: any, value: string, callback: any) => {
      if (value === null || value.trim() === "") {
        callback(new Error("请输入验证码"));
      } else {
        callback(); // Pass null when validation succeeds
      }
    };

    const rules = reactive<FormRules<typeof ruleForm>>({
      username: [{ validator: validateUsername, trigger: "blur" }],
      password: [{ validator: validatePassword, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }],
    });

    const submitForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          loading.value = true;
          store
            .dispatch("user/login", ruleForm.value)
            .then(() => {
              refreshToken();
            })
            .catch((error) => {
              console.log(error);
              loading.value = false;
              errorMessage(error);
              refreshIDCode();
            });
        } else {
          return false;
        }
      });
    };

    const resetForm = (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      formEl.resetFields();
    };

    const errorMessage = (error: ResponseObject) => {
      ElMessage({
        showClose: true,
        message: "[" + error.Code + "]" + error.Msg,
        type: "error",
      });
    };

    const refreshIDCode = () => {
      console.log("refreshIDCode");
      loadingCode.value = true;
      getImagecode()
        .then((response: ResponseObject) => {
          codeurl.value = response.Data?.URL ?? "";
          ruleForm.value.codeid = response.Data?.ID ?? "";
          ruleForm.value.code = response.Data?.Code ?? "";
          console.log(codeurl.value);
        })
        .catch((error) => {
          loadingCode.value = false;
          codeurl.value = "";
          errorMessage(error);
        });
    };
    const refreshToken = () => {
      store
        .dispatch("user/refreshToken", {
          username: ruleForm.value.username,
          password: ruleForm.value.password,
        })
        .then(() => {
          getUserInfo();
        })
        .catch((error) => {
          loading.value = false;
          errorMessage(error);
          refreshIDCode();
        });
    };
    const getUserInfo = () => {
      store
        .dispatch("user/getInfo")
        .then(() => {
          loading.value = false;
          if (redirect === "") router.push({ path: "/tasklist" });
          else router.push({ path: redirect });
          // this.$router.push({
          //   path: this.redirect || "/tasklist",
          //   query: this.otherQuery,
          // });
        })
        .catch((error) => {
          loading.value = false;
          errorMessage(error);
          refreshIDCode();
        });
    };
    onMounted(() => {
      console.log("redirect");
      console.log(redirect);
      refreshIDCode();
    });
    // Watch for changes in the route object
    watch(
      () => router.currentRoute.value,
      (to, from) => {
        // This callback will be called whenever the route changes
        console.log("New Route:", to);
        console.log("Previous Route:", from);
      }
    );
    return {
      imgbg,
      loading,
      ruleFormRef,
      ruleForm,
      rules,
      redirect,
      otherQuery: {},
      codeurl,
      submitForm,
      refreshIDCode,
    };
  },
});
</script>

<style lang="scss" scoped></style>
