<template>
  <el-container class="app-container">
    <el-header class="header-container">
      <div class="header-container-condition">
        <el-form :inline="true">
          <el-form-item label="设备名称">
            <el-select
              v-model="device"
              value-key="ID"
              placeholder="请选择"
              @change="selectChanged"
            >
              <el-option
                v-for="item in deviceOptions"
                :key="item.ID"
                :label="item.DevText"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-space>
          <el-button class="red" icon="DeleteFilled" disabled>删除</el-button>
          <el-button @click="handleQuery" icon="Refresh" :loading="loading"
            >刷新</el-button
          >
        </el-space>
      </div>
    </el-header>
    <el-main class="main-container container-border">
      <el-tree
        ref="treeRef"
        :data="fileTree"
        show-checkbox
        :load="loadNode"
        lazy
        node-key="FullName"
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
    </el-main>
    <el-footer class="footer-container"> </el-footer>
  </el-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  FileItem,
  apiGetDeviceFileList,
  apiDeleteDeviveFiles,
} from "@/api/file";
import { useStore } from "vuex";
import { ElMessage, ElMessageBox } from "element-plus";
import { dateTimeFormat, fileSizeFormat } from "@/api/format";
import { apiGetDeviceOptions, DeviceInfo } from "@/api/device";
import { ElTree } from "element-plus";
import type Node from "element-plus/es/components/tree/src/model/node";
export default defineComponent({
  name: "DeviceFiles",
  props: {
    msg: String,
  },
  setup() {
    const loading = ref(false);
    const store = useStore();

    const device = ref<DeviceInfo>({ ID: 0, DevText: "请选择" });
    const deviceOptions = ref<DeviceInfo[]>([]);
    const fileTree = ref<FileItem[]>([]);
    const treeRef = ref<InstanceType<typeof ElTree>>();
    const expandedKeys = ref<string[]>([]);
    const multipleSelection = ref<FileItem[]>([]);
    const defaultProps = {
      children: "Children",
      label: "Name",
      isLeaf: "hasChildren",
    };

    onMounted(() => {
      apiGetDevices();
    });

    const apiGetDevices = () => {
      apiGetDeviceOptions({
        Data: { Enabled: 1 },
      })
        .then((response) => {
          deviceOptions.value = [{ ID: 0, DevText: "请选择" }];
          const responseData = response.Data?.Data;
          for (const item of responseData) {
            deviceOptions.value.push(item);
          }
        })
        .catch((error) => {
          loading.value = false;
          ElMessage.error(error.Msg);
        });
    };
    const getFileTree = () => {
      if (device.value.ID === 0) return;
      loading.value = true;
      fileTree.value = [];
      multipleSelection.value = [];
      apiGetDeviceFileList({
        Data: { DevID: device.value.ID, Dir: "" },
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

    const handleQuery = () => {
      if (device.value.ID === 0) {
        ElMessage.warning("请选择需要查看的设备.");
      }
      //expandedKeys.value = [];
      getFileTree();
    };
    const selectChanged = () => {
      getFileTree();
    };
    const loadNode = (node: Node, resolve: (data: FileItem[]) => void) => {
      if (node.data.FullName) {
        apiGetDeviceFileList({
          Data: { DevID: device.value.ID, Dir: node.data.FullName },
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
          apiDeleteDeviveFiles({
            Data: { DevID: device.value.ID, List: list },
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
    return {
      loading,
      fileTree,
      defaultProps,
      device,
      deviceOptions,
      expandedKeys,
      dateTimeFormat,
      fileSizeFormat,
      handleQuery,
      handleDelete,
      nodeExpand,
      nodeCollapse,
      checkChange,
      selectChanged,
      loadNode,
    };
  },
});
</script>
