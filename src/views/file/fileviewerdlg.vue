<template>
  <div class="dialog-container">
    <el-dialog
      v-model="innerVisible"
      :title="title"
      :width="1200"
      :before-close="dlgClose"
      center
      destroy-on-close
    >
      <el-scrollbar ref="scrollbarRef" height="600px" @scroll="handleScroll">
        <div style="font-size: 22px">
          <pre
            class="line-numbers"
            :class="codeClass"
            data-start="1"
          ><code :class="codeClass">{{ content }}</code></pre>
        </div>
      </el-scrollbar>

      <template #footer>
        <div style="float: left; margin-left: 20px">
          <el-button v-loading="loading" plain text></el-button>
          <el-text>{{ loadMsg }}</el-text>
        </div>

        <span class="dialog-footer">
          <el-button class="dialog-button" @click="dlgClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  nextTick,
  reactive,
} from "vue";
import { useStore } from "vuex";
import { DialogResult } from "@/api/interface";
import { FileCondition, apiReadFile } from "@/api/file";
import { ElMessage } from "element-plus";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-gcode";
//注意只能选一个样式
import "prismjs/themes/prism.min.css";
//import "prismjs/themes/prism-dark.min.css";

import "prismjs/plugins/line-numbers/prism-line-numbers.min.js"; //行号插件
import "prismjs/plugins/line-numbers/prism-line-numbers.min.css"; //行号插件的样式
import { ElScrollbar } from "element-plus";
export default defineComponent({
  name: "FileViewerDlg",
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    param: {
      type: Object as () => FileCondition,
      default: () => {
        return { Dir: "" };
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

    const title = ref("");
    const content = ref("");
    const html = ref("");
    const total = ref(-1);
    const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
    const condition = reactive<FileCondition>({
      Path: "",
      Encoding: "",
      PageIndex: 0,
      PageSize: 30,
    });
    const codeClass = ref("language-gcode");
    const loadMsg = ref("");
    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        if (newValue === true) {
          title.value = "文件：" + props.param.Path;
          condition.Path = props.param.Path;
          init();
          readFile();
        }
      }
    );

    onMounted(() => {
      nextTick(() => {
        Prism.highlightAll();
      });
    });
    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };
    const init = () => {
      condition.PageIndex = 0;
      condition.Encoding = "";
      total.value = -1;
      content.value = "";
      loadMsg.value = "";
      loading.value = false;

      //判断文件后缀
      var parts = condition.Path?.split(".");
      if (parts === undefined) return;
      // The last part is the extension
      var fileExtension = parts[parts.length - 1];

      // Check if the extension is "json" or "anc" (case-insensitive)
      if (fileExtension.toLowerCase() === "json") {
        codeClass.value = "language-json";
      } else if (fileExtension.toLowerCase() === "anc") {
        codeClass.value = "language-gcode";
      } else if (fileExtension.toLowerCase() === "n") {
        codeClass.value = "language-gcode";
      } else {
        codeClass.value = "language-vim";
      }
      console.log(codeClass);
    };
    const handleScroll = (event: any) => {
      if (scrollbarRef.value) {
        if (scrollbarRef.value.wrapRef) {
          const maxScrollHeight = scrollbarRef.value.wrapRef.scrollHeight; // Get the maximum scrollable height
          const clientHeight = scrollbarRef.value.wrapRef.clientHeight;

          if (event.scrollTop === maxScrollHeight - clientHeight) {
            readFile();
          }
        }
      }
    };
    const readFile = () => {
      if (condition.PageIndex === undefined) condition.PageIndex = 0;
      if (condition.PageSize === undefined) condition.PageSize = 30;
      if (
        total.value > 0 &&
        condition.PageIndex * condition.PageSize >= total.value
      ) {
        loadMsg.value = "已经到底了";
        return;
      }

      if (loading.value) return;
      condition.PageIndex = condition.PageIndex + 1;

      loading.value = true;
      loadMsg.value = "文件加载中...";
      apiReadFile({
        Data: condition,
        OperID: store.getters.user.ID,
      })
        .then((response) => {
          loading.value = false;
          loadMsg.value = "";
          content.value = content.value + response.Data.Data;
          if (condition.PageIndex === 1) {
            total.value = response.Data?.Total;
            condition.Encoding = response.Data?.Encoding;
          }
          nextTick(() => {
            Prism.highlightAll();
          });
        })
        .catch((error) => {
          loading.value = false;
          loadMsg.value = "加载失败，请重试";
          ElMessage.error(error.Msg);
        });
    };
    const dlgTest = () => {
      nextTick(() => {
        Prism.highlightAll();
      });
    };
    return {
      handleScroll,
      loading,
      innerVisible,
      title,
      content,
      dlgClose,
      html,
      scrollbarRef,
      codeClass,
      loadMsg,
      condition,
      dlgTest,
    };
  },
});
</script>
<style lang="scss" scoped></style>
