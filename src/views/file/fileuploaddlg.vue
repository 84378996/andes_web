<template>
  <div class="dialog-container">
    <el-dialog
      v-model="innerVisible"
      title="上传文件"
      :width="1200"
      :before-close="dlgClose"
      center
      destroy-on-close
    >
      <uploader
        ref="uploadRef"
        :options="options"
        :file-status-text="fileStatusText"
        :auto-start="false"
        class="uploader-example"
        @file-complete="fileComplete"
        @complete="complete"
        @file-success="fileSuccess"
      >
        <!-- 不支持 HTML5 File API 的时候会显示。遇到低版本的浏览器不兼容组件的时候才会展示 -->
        <uploader-unsupport />
        <uploader-drop>
          <div style="padding: 10px 0px">
            <el-text>目标文件夹:</el-text>
            <el-text style="margin-left: 10px" type="success">{{
              param.Path === "" ? "根目录" : param.Path
            }}</el-text>
          </div>
          <div class="container-space-between">
            <el-space>
              <!-- <uploader-btn ref="uploaderFilesRef" :attrs="attrs"
                >选择文件</uploader-btn
              > -->
              <uploader-btn :attrs="attrs">选择文件</uploader-btn>
              <uploader-btn :directory="true">选择文件夹</uploader-btn>
            </el-space>
            <el-space>
              <el-button @click="handleStart" type="primary" plain
                >开始上传</el-button
              >
              <el-button @click="handlePause" type="primary" plain
                >暂停</el-button
              >
              <el-button @click="handleResume" type="primary" plain
                >继续上传</el-button
              >
              <el-button @click="handleRemove" type="primary" plain
                >移除已完成</el-button
              >
              <el-button @click="handleCancel" type="primary" plain
                >全部取消</el-button
              >
            </el-space>
          </div>
        </uploader-drop>
        <uploader-list />
      </uploader>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dlgClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch, onMounted, nextTick } from "vue";
import { useStore } from "vuex";
import { DialogResult } from "@/api/interface";
import { FileCondition } from "@/api/file";

export default defineComponent({
  name: "FileUploadDlg",
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

    const options = ref({
      // target: process.env.API_ROOT + '/api/TechFile/UploadFileResume',
      target: "/api/File/UploadFile",
      testChunks: false,
      chunkSize: 1 * 1024 * 1024, // 1MB
      simultaneousUploads: 3, // 并发上传数
      singleFile: false,
      query: {
        operId: 0,
        rootDir: "",
      },
      headers: {},
      parseTimeRemaining: function (
        timeRemaining: number,
        parsedTimeRemaining: string
      ) {
        return parsedTimeRemaining
          .replace(/\syears?/, "年")
          .replace(/\days?/, "天")
          .replace(/\shours?/, "小时")
          .replace(/\sminutes?/, "分钟")
          .replace(/\sseconds?/, "秒");
      },
    });
    const attrs = {
      accept: ".anc,.json",
    };
    const statusTextMap = {
      success: "成功",
      error: "错误",
      uploading: "上传中",
      paused: "暂停",
      waiting: "等待",
    };
    watch(
      () => props.visible,
      (newValue) => {
        innerVisible.value = newValue;
        if (innerVisible.value) {
          options.value.query.rootDir = props.param.Path ?? "";
        } else {
          if (uploadRef.value) {
            uploadRef.value.uploader.cancel();
          }
        }
      }
    );

    const uploadRef = ref<any | null>(null);
    //const uploaderFilesRef = ref<any | null>(null);
    onMounted(() => {
      nextTick(() => {
        //window.uploader = uploadRef.value?.uploader;
      });
    });
    const dlgClose = () => {
      let param: DialogResult = { show: false };
      emit("dialogCallback", param);
    };
    const complete = () => {
      console.log("complete", arguments);
    };
    const fileComplete = () => {
      console.log("file complete", arguments);
    };

    const fileStatusText = (status: string, response: any) => {
      if (status === "success") return statusTextMap.success;
      else if (status === "error") {
        console.log(response);
        return response;
      } else if (status === "uploading") return statusTextMap.uploading;
      else if (status === "paused") return statusTextMap.paused;
      else if (status === "waiting") return statusTextMap.waiting;
    };
    const fileSuccess = (
      rootFile: any,
      file: any,
      message: any,
      chunk: any
    ) => {
      console.log("rootFile");
      console.log(rootFile);
      console.log("file");
      console.log(file);
      console.log("message");
      console.log(message);
      console.log("chunk");
      console.log(chunk);
    };
    const handleStart = () => {
      if (uploadRef.value) {
        uploadRef.value.uploader.upload();
      }
    };
    const handlePause = () => {
      if (uploadRef.value) {
        uploadRef.value.uploader.pause();
      }
    };
    const handleResume = () => {
      if (uploadRef.value) {
        uploadRef.value.uploader.resume();
      }
    };
    const handleCancel = () => {
      if (uploadRef.value) {
        uploadRef.value.uploader.cancel();
      }
    };
    const handleRemove = () => {
      if (uploadRef.value) {
        var fileList: any[] = uploadRef.value.uploader.fileList;
        console.log(fileList);
        var completeList = [];
        if (fileList) {
          for (var i = 0; i < fileList.length; i++)
            if (fileList[i].completed) completeList.push(fileList[i]);
        }
        console.log(completeList);
        for (var j = 0; j < completeList.length; j++)
          uploadRef.value.uploader.removeFile(completeList[j]);
      }
    };

    return {
      loading,
      innerVisible,
      options,
      attrs,
      uploadRef,
      //uploaderFilesRef,
      dlgClose,
      fileStatusText,
      complete,
      fileComplete,
      handlePause,
      fileSuccess,
      handleStart,
      handleResume,
      handleCancel,
      handleRemove,
    };
  },
});
</script>
<style lang="scss" scoped></style>
