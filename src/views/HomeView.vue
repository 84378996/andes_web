<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <el-button type="danger" icon="Delete" circle />
    <div>
      <svg-icon iconClass="fullscreen"></svg-icon>
      <svg-icon iconClass="message" style="margin-left: 50px"></svg-icon>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
// eslint-disable-next-line
import { Delete } from "@element-plus/icons-vue";
export default defineComponent({
  name: "HomeView",
  components: {
    HelloWorld,
  },
});
</script>
