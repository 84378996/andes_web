<template>
  <el-container class="layout-container">
    <el-aside :class="{ hideSidebar: isCollapse }">
      <SideBar />
    </el-aside>
    <el-container>
      <el-header class="navbar">
        <NavBar />
      </el-header>
      <el-container>
        <el-header class="tagsview">
          <TagsView />
        </el-header>
        <el-main class="main"><AppMain /></el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

import SideBar from "./sidebar.vue";
import NavBar from "./navbar.vue";
import AppMain from "./appmain.vue";
import TagsView from "./tagsview.vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "LayoutIndex",
  components: { SideBar, AppMain, TagsView, NavBar },
  setup() {
    const store = useStore();

    return {
      isCollapse: computed(() => !store.getters.sidebar),
    };
  },
});
</script>

<style lang="scss" scoped>
@import "@/styles/variables.scss";

.layout-container {
  width: 100%;
  height: 100%;
}

.layout-container .navbar {
  height: 55px;
  margin: 0px;
  padding: 0px;
}

.layout-container .el-menu {
  border-right: none;
}
.layout-container .el-main {
  height: calc(100vh - 55px - 36px);
  padding: 0px;
}
.layout-container .el-footer {
  background: rgb(92, 173, 173);
}

.layout-container .el-aside {
  width: $sideBarWidth;
  height: 100%;
  transition: 0.3s;
  background: rgb(10, 97, 97);
}
.layout-container .hideSidebar {
  width: 65px !important;
}
.layout-container .tagsview {
  height: 36px;
  padding: 0px;
  box-shadow: var(--el-box-shadow-light);
}
</style>
