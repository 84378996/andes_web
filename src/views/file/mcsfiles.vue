<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-button class="green" icon="Upload" @click="handleUpload(null)"
          >上传文件</el-button
        >

        <el-space>
          <el-button
            class="red"
            icon="DeleteFilled"
            :disabled="multipleSelection.length === 0"
            @click="handleDelete(multipleSelection)"
            >删除</el-button
          >

          <el-button
            class="green"
            @click="handleRefresh"
            icon="Refresh"
            :loading="loading"
            >刷新</el-button
          ></el-space
        >
      </div>
    </el-header>
    <el-main class="main-container container-border">
      <el-tree
        ref="treeRef"
        :data="fileTree"
        show-checkbox
        node-key="FullName"
        :load="loadNode"
        lazy
        :props="defaultProps"
        :expand-on-click-node="false"
        :default-expanded-keys="expandedKeys"
        @node-expand="nodeExpand"
        @node-collapse="nodeCollapse"
        @check-change="checkChange"
      >
        <template #default="{ node, data }">
          <div class="tree-node">
            <el-space :size="5" style="width: 300px">
              <div style="width: 10px"></div>
              <el-icon
                color="#EEBF17"
                :size="18"
                v-if="data.Type === 1 && node.expanded === false"
                ><Folder
              /></el-icon>
              <el-icon
                color="#EEBF17"
                :size="18"
                v-if="data.Type === 1 && node.expanded"
                ><FolderOpened
              /></el-icon>
              <el-text>{{ node.label }}</el-text>
            </el-space>
            <el-text style="width: 200px; text-align: right">
              {{ dateTimeFormat(data.LastWriteTime) }}
            </el-text>

            <el-text
              v-if="data.Type === 0"
              style="width: 100px; text-align: right"
            >
              {{ fileSizeFormat(data.Size) }}</el-text
            >
            <div style="width: 20px"></div>
            <el-space>
              <el-button
                class="el-table-button"
                type="primary"
                plain
                v-if="data.Type === 1"
                @click="handleUpload(data)"
              >
                <el-icon>
                  <Upload />
                </el-icon>
                上传文件
              </el-button>
              <el-button
                class="el-table-button"
                type="primary"
                plain
                v-if="data.Type === 0"
                @click="handleViewer(data)"
              >
                <el-icon>
                  <View />
                </el-icon>
                查看
              </el-button>
              <el-button
                class="el-table-button"
                type="primary"
                plain
                @click="handleDelete([data])"
              >
                <el-icon>
                  <DeleteFilled />
                </el-icon>
                删除
              </el-button>
            </el-space>
          </div>
        </template>
      </el-tree>
      <FileUploadDlg
        :visible="isFileUploadDlgVisible"
        :param="dlgParam"
        @dialogCallback="FileUploadDlgCallback"
      />
      <FileViewerDlg
        :visible="isFileViewerDlgVisible"
        :param="dlgParam"
        @dialogCallback="FileViewerDlgCallback"
      />
    </el-main>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import { FileItem, apiGetFileList, apiDeleteFiles } from "@/api/file";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateTimeFormat, fileSizeFormat } from "@/api/format";
import FileUploadDlg from "./fileuploaddlg.vue";
import FileViewerDlg from "./fileviewerdlg.vue";
import { DialogResult } from "@/api/interface";
import { FileCondition } from "@/api/file";
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
export default defineComponent({
  name: "MCSFiles",
  components: { FileUploadDlg, FileViewerDlg },
  props: {
    msg: String,
  },
  setup() {
    const loading = ref(false);
    const store = useStore();
    const rootPath = ref("");
    const isFileUploadDlgVisible = ref(false);
    const isFileViewerDlgVisible = ref(false);
    const fileTree = ref<FileItem[]>([]);
    const treeRef = ref<InstanceType<typeof ElTree>>();
    const expandedKeys = ref<string[]>([]);
    const multipleSelection = ref<FileItem[]>([]);
    const dlgParam = ref<FileCondition>({});
    const defaultProps = {
      children: "Children",
      label: "Name",
      isLeaf: "hasChildren",
    };

    onMounted(() => {
      getFileTree();
    });
    const getFileTree = () => {
      loading.value = true;
      fileTree.value = [];
      multipleSelection.value = [];
      apiGetFileList({
        Data: { Dir: rootPath.value },
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          fileTree.value = response.Data?.Data;
          fileTree.value.forEach((value, index) => {
            if (value.Type === 1) fileTree.value[index].hasChildren = false;
            else fileTree.value[index].hasChildren = true;
          });
          if (fileTree.value.length === 0) ElMessage.info("当前还没有文件！");
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };

    const handleRefresh = () => {
      getFileTree();
    };

    const FileUploadDlgCallback = (param: DialogResult) => {
      isFileUploadDlgVisible.value = param.show ?? false;
    };
    const FileViewerDlgCallback = (param: DialogResult) => {
      isFileViewerDlgVisible.value = param.show ?? false;
    };

    const handleUpload = (data: FileItem | null) => {
      if (data === null) dlgParam.value.Path = "";
      else {
        if (data.FullName === undefined) dlgParam.value.Path = "";
        else if (data.FullName === null) dlgParam.value.Path = "";
        else dlgParam.value.Path = data.FullName;
      }
      isFileUploadDlgVisible.value = true;
    };

    const handleViewer = (data: FileItem | null) => {
      if (data === null) dlgParam.value.Path = "";
      else {
        if (data.FullName === undefined) dlgParam.value.Path = "";
        else if (data.FullName === null) dlgParam.value.Path = "";
        else dlgParam.value.Path = data.FullName;
      }
      isFileViewerDlgVisible.value = true;
    };

    const handleDelete = (list: FileItem[]) => {
      if (list.length === 0) {
        ElMessage.warning("请先选择要删除的行");
        return;
      }

      var str = "";
      for (var i = 0; i < list.length; i++) {
        var row = list[i];

        str = str + "【" + row.Name + "】";
      }

      ElMessageBox.confirm("即将删除 " + str + " ,是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          apiDeleteFiles({
            Data: { List: list },
            OperID: store.getters.user.ID,
          })
            .then(() => {
              ElMessage.success("删除成功");

              getFileTree();
            })
            .catch((error) => {
              ElMessage.error(error.Msg);
            });
        })
        .catch(() => {
          return;
        });
    };

    const nodeExpand = (data: FileItem) => {
      if (data.FullName === undefined) return;
      if (data.FullName === null) return;
      if (expandedKeys.value.includes(data.FullName)) return;
      expandedKeys.value.push(data.FullName);
    };
    const nodeCollapse = (data: FileItem) => {
      if (data.FullName === undefined) return;
      if (data.FullName === null) return;

      const index = expandedKeys.value.indexOf(data.FullName);
      if (index !== -1) {
        expandedKeys.value.splice(index, 1);
      }
    };
    const checkChange = () => {
      //FileItem[] list=  getCheckedNodes();
      if (treeRef.value) {
        multipleSelection.value = treeRef.value.getCheckedNodes();
      }
    };
    const loadNode = (node: Node, resolve: (data: FileItem[]) => void) => {
      if (node.data.FullName) {
        apiGetFileList({
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
    return {
      loading,
      fileTree,
      treeRef,
      defaultProps,
      expandedKeys,
      isFileUploadDlgVisible,
      isFileViewerDlgVisible,
      multipleSelection,
      dlgParam,
      dateTimeFormat,
      fileSizeFormat,
      handleRefresh,
      FileUploadDlgCallback,
      FileViewerDlgCallback,
      handleUpload,
      handleDelete,
      nodeExpand,
      nodeCollapse,
      checkChange,
      loadNode,
      handleViewer,
    };
  },
});
</script>
