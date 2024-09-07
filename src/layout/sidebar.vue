<template>
  <div class="sidebar">
    <div class="logo" v-bind:class="{ small: isCollapse }">
      <!-- <el-image :src="logourl" fit="fill"></el-image> -->
    </div>
    <div class="menudiv">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          router
          :collapse-transition="true"
          :default-active="route.path"
          :collapse="isCollapse"
          active-text-color="#ffd04b"
          background-color="#001529"
          text-color="#fff"
        >
          <MenuItem
            v-for="item in routes"
            :key="item.path"
            :item="item"
            :basePath="''"
          />
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import MenuItem from "./menuitem.vue";
import imglogo from "@/assets/head-logo-red-2.png";
import imglogosmall from "@/assets/head-logo-red-small.png";
export default defineComponent({
  name: "SideBar",
  components: { MenuItem },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();

    const routes = computed(() => {
      return router.options.routes;
      //权限
      //console.log(store.getters.routes);
      //return store.getters.routes;
    });
    const logourl = computed(() => {
      if (!store.getters.sidebar) return imglogosmall;
      else return imglogo;
    });
    const isCollapse = computed(() => {
      return !store.getters.sidebar;
    });
    return {
      isCollapse,
      routes,
      logourl,
      route,
    };
  },
});
</script>
<style lang="scss" scoped></style>
