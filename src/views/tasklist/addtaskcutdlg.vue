<template>
  <el-dialog
    v-model="innerVisible"
    title="添加任务信息"
    :width="1000"
    :before-close="dlgClose"
    center
    destroy-on-close
  >
    <el-row>
      <el-col :span="12">
        <div style="height: 500px" class="tree-border">
          <el-scrollbar>
            <el-tree
              ref="treeRef"
              :data="fileTree"
              :props="defaultProps"
              @node-click="handleNodeClick"
              :load="loadNode"
              lazy
            >
              <template #default="{ node, data }">
                <el-space :size="5">
                  <div style="width: 10px"></div>
                  <el-icon
                    color="#ECC849"
                    :size="18"
                    v-if="data.Type === 1 && node.expanded === false"
                    ><Folder
                  /></el-icon>
                  <el-icon
                    color="#ECC849"
                    :size="18"
                    v-if="data.Type === 1 && node.expanded"
                    ><FolderOpened
                  /></el-icon>
                  <el-text>{{ node.label }}</el-text>
                </el-space>
              </template>
            </el-tree>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="12">
        <el-form
          ref="ruleFormRef"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="文件名" prop="TaskName">
            <el-input v-model="ruleForm.TaskName"></el-input>
          </el-form-item>
          <el-form-item label="路径" prop="Path">
            <el-input v-model="ruleForm.Path"></el-input>
          </el-form-item>
          <el-form-item label="材料" prop="Material">
            <el-select v-model="ruleForm.Material">
              <el-option label="碳钢" value="碳钢" />
            </el-select>
          </el-form-item>
          <el-form-item label="数量" prop="TotalCount">
            <el-input v-model="ruleForm.TotalCount"></el-input>
          </el-form-item>
          <el-form-item label="长" prop="Length">
            <el-input v-model="ruleForm.Length"
              ><template #append>mm</template></el-input
            >
          </el-form-item>
          <el-form-item label="宽" prop="Width">
            <el-input v-model="ruleForm.Width"
              ><template #append>mm</template></el-input
            >
          </el-form-item>
          <el-form-item label="厚" prop="Thickness">
            <el-input v-model="ruleForm.Thickness"
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
              添加
            </el-button>
            <el-button @click="dlgClose" style="width: 100px">关闭</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
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
import { apiAddTaskCut, TaskCut, TaskCutList } from "@/api/task";
import { DialogResult } from "@/api/interface";
import { ElMessage } from "element-plus";
import { FileItem, apiGetTaskFiles, apiReadCutFileHeader } from "@/api/file";
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
export default defineComponent({
  name: "TaskCutAddDlg",
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
    const treeLoading = ref(false);
    const fileTree = ref<FileItem[]>([]);
    const treeRef = ref<InstanceType<typeof ElTree>>();
    const errorMsg = ref("");
    const defaultProps = {
      children: "Children",
      label: "Name",
      isLeaf: "hasChildren",
    };
    const searchName = ref("");
    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        if (newValue === true) {
          getFileTree();
        }
      }
    );
    //onMounted(() => {});

    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };
    const getFileTree = () => {
      treeLoading.value = true;
      fileTree.value = [];

      apiGetTaskFiles({
        Data: { Dir: "" },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          console.log(response);
          treeLoading.value = false;
          fileTree.value = response.Data?.Data;
          fileTree.value.forEach((value, index) => {
            if (value.Type === 1) fileTree.value[index].hasChildren = false;
            else fileTree.value[index].hasChildren = true;
          });
          if (fileTree.value.length === 0) ElMessage.info("当前还没有文件！");
        })
        .catch((error) => {
          treeLoading.value = false;
          ElMessage.error(error.Msg);
        });
    };
    const loadNode = (node: Node, resolve: (data: FileItem[]) => void) => {
      if (node.data.FullName) {
        apiGetTaskFiles({
          Data: { Dir: node.data.FullName },
          OperID: store.getters.user.ID,
        })
          .then((response) => {
            const childNodes: FileItem[] = response.Data?.Data;

            childNodes.forEach((value, index) => {
              if (value.Type === 1) childNodes[index].hasChildren = false;
              else childNodes[index].hasChildren = true;
            });

            resolve(childNodes);
          })
          .catch((error) => {
            ElMessage.error(error.Msg);
            resolve([]);
          });
      }
    };
    const submitForm = async (formEl: FormInstance | undefined) => {
      if (!formEl) return;
      await formEl.validate((valid) => {
        if (valid) {
          //const data = ref({ ...ruleForm });
          //emit("addCallback", data.value);
          ruleForm.TaskID = props.param.ID;
          errorMsg.value = "";
          apiAddTaskCut({
            Data: ruleForm,
            OperID: store.getters.user.ID,
          })
            .then(() => {
              loading.value = false;

              ruleForm.TaskName = "";
              ruleForm.Path = "";
              ruleForm.Material = "";
              ruleForm.Length = null;
              ruleForm.Width = null;
              ruleForm.Thickness = null;
              ruleForm.TotalCount = null;
              ElMessage.info("添加成功");
            })
            .catch((error) => {
              loading.value = false;
              errorMsg.value = error.Msg;
              //ElMessage.error(error.Msg);
            });
        }
      });
    };

    const handleNodeClick = (data: FileItem) => {
      if (data.Type !== 0) return;

      ruleForm.TaskName = data.Name;
      ruleForm.Path = data.FullName;
      ruleForm.Material = "";
      ruleForm.Thickness = null;
      ruleForm.Length = null;
      ruleForm.Width = null;
      apiReadCutFileHeader({
        Data: { FileName: data.FullName },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          var tc: TaskCut = response.Data.Data;
          ruleForm.Material = tc.Material;
          ruleForm.Thickness = tc.Thickness;
          ruleForm.Length = tc.Length;
          ruleForm.Width = tc.Width;
        })
        .catch((error) => {
          ElMessage.error(error.Msg);
        });
    };

    return {
      loading,
      innerVisible,
      treeLoading,
      searchName,
      treeRef,
      ruleFormRef,
      ruleForm,
      rules,
      fileTree,
      defaultProps,
      errorMsg,
      dlgClose,
      submitForm,
      handleNodeClick,
      loadNode,
    };
  },
});
</script>
<style lang="scss" scoped></style>
