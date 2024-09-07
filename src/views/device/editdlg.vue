<template>
  <div class="dialog-container">
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
            <el-form-item label="设备名称" prop="DevText">
              <el-input v-model="ruleForm.DevText" maxlength="90"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备类型" prop="DevType">
              <el-select v-model="ruleForm.DevType">
                <el-option label="WMS" value="WMS" />
                <el-option label="Delivery" value="Delivery" />
                <el-option label="Marker" value="Marker" />
                <el-option label="Laser" value="Laser" />
                <el-option label="MCS" value="MCS" />
              </el-select>
            </el-form-item> </el-col
        ></el-row>
        <el-row
          ><el-col :span="12">
            <el-form-item label="IP地址" prop="IP">
              <el-input v-model="ruleForm.IP" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试" prop="Test">
              <el-switch v-model="ruleForm.Test" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row
          ><el-col :span="12">
            <el-form-item label="Ftp主机" prop="FtpHost">
              <el-input v-model="ruleForm.FtpHost" maxlength="90"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ftp端口号" prop="FtpPort">
              <el-input v-model="ruleForm.FtpPort" maxlength="20"></el-input>
            </el-form-item> </el-col
        ></el-row>
        <el-row
          ><el-col :span="12">
            <el-form-item label="Ftp用户名" prop="FtpUser">
              <el-input v-model="ruleForm.FtpUser"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Ftp密码" prop="FtpPwd">
              <el-input v-model="ruleForm.FtpPwd"></el-input>
            </el-form-item> </el-col
        ></el-row>
        <el-form-item label="Ftp根目录" prop="Enabled">
          <el-input v-model="ruleForm.FtpRoot"></el-input>
        </el-form-item>
        <el-form-item label="设备状态" prop="Enabled">
          <el-radio-group v-model="ruleForm.Enabled">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">维修中</el-radio>
            <el-radio :label="3">报废</el-radio>
            <el-radio :label="4">闲置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="url 1" prop="Url1">
          <el-input v-model="ruleForm.Url1" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="url 2" prop="Url2">
          <el-input v-model="ruleForm.Url2" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="url 3" prop="Url3">
          <el-input v-model="ruleForm.Url3" maxlength="250"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="Remark" style="margin-bottom: 0px">
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
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, watch } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { useStore } from "vuex";
import {
  apiGetDevice,
  apiModifyDevice,
  DeviceInfo,
  resetDeviceInfo,
  DeviceCondition,
} from "@/api/device";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "DeviceEditDlg",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => DeviceCondition,
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
    const dialogTitle = ref("设备信息");
    const ruleForm = reactive<DeviceInfo>({});
    const isAdd = ref(false);
    const rules = reactive<FormRules<DeviceInfo>>({
      DevText: [
        {
          type: "string",
          required: true,
          message: "请输入设备名称",
          trigger: "blur",
        },
      ],
      DevType: [
        {
          required: true,
          message: "请选择设备类型",
          trigger: "blur",
        },
      ],
      FtpPort: [
        //{ required: true, message: "请输入Ftp端口号" },
        {
          type: "number",
          message: "请输入正确的端口号",
          trigger: "blur",
          transform: (value) => Number(value),
        },
      ],
      Enabled: [
        {
          required: true,
          message: "请选择设备状态",
          trigger: "blur",
        },
      ],
    });

    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        resetDeviceInfo(ruleForm);
        if (newValue === true) init();
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
      dialogTitle.value = "添加设备信息";
      ruleForm.ID = 0;
      ruleForm.Enabled = 1;
      isAdd.value = true;
    };

    const initEdit = () => {
      dialogTitle.value = "编辑设备信息";
      ruleForm.ID = props.param.ID;
      isAdd.value = false;
      loading.value = true;

      apiGetDevice({
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
          if (isAdd.value) addDevice();
          else modifyDevice();
        }
      });
    };
    const addDevice = () => {
      return;
    };
    const modifyDevice = () => {
      loading.value = true;
      apiModifyDevice({
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
      dlgClose,
      submitForm,
      isAdd,
      dialogTitle,
      ruleFormRef,
      ruleForm,
      rules,
    };
  },
});
</script>
<style lang="scss" scoped></style>
