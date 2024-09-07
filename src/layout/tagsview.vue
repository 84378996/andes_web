<template>
  <div class="tags-view-container">
    <el-scrollbar ref="scrollbarRef">
      <div class="scrollbar-flex-content">
        <router-link
          v-for="tag in visitedViews"
          :key="tag.path"
          :class="isActive(tag) ? 'active' : ''"
          :to="tag"
          class="tags-view-item"
        >
          {{ tag.meta?.title }}{{ titleAdditional(tag) }}
          <el-button
            v-if="!isAffix(tag)"
            class="icon-close"
            @click.prevent.stop="closeSelectedTag(tag)"
          >
            <el-icon color="#909399">
              <Close />
            </el-icon>
          </el-button>
        </router-link>
      </div>
    </el-scrollbar>

    <el-space>
      <el-button
        class="el-button-icon"
        @click="refresh"
        size="default"
        v-show="false"
      >
        <el-icon :size="20" color="#909399">
          <RefreshRight />
        </el-icon>
      </el-button>

      <el-dropdown @command="handleDropdownCommand">
        <el-button class="el-button-icon" type="primary" size="default">
          <el-icon :size="20" color="#909399">
            <ArrowDown />
          </el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="closeCurrent">关闭</el-dropdown-item>
            <el-dropdown-item command="closeOther">关闭其它</el-dropdown-item>
            <el-dropdown-item divided command="closeAll"
              >关闭所有</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-space>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter, RouteLocationNormalized } from "vue-router";
import { CustomRouteMeta } from "@/api/interface";
import { ElScrollbar } from "element-plus";
export default defineComponent({
  name: "TagsView",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    let scrollleft = ref(0);
    let selectedTag: null;
    let menushow = ref(false);
    let left = ref(0);
    let top = ref(0);

    const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
    const visitedViews = computed<RouteLocationNormalized[]>(() => {
      return store.getters.visitedViews;
    });
    const addTag = () => {
      const { name } = route;

      if (name) {
        const item: RouteLocationNormalized = { ...route };

        store.dispatch("tagsview/addView", item);
      }

      //console.log("visitedViews");
      //console.log(store.getters.visitedViews);
    };
    const move = (value: number) => {
      // let wrap = this.$refs.scrollbar.$refs.wrap;
      // wrap.scrollLeft = wrap.scrollLeft + value;
      // this.$refs.scrollbar.update();
    };
    const isActive = (item: RouteLocationNormalized) => {
      //return item.path === route.path;
      if (item.name === route.name) {
        if (item.params && route.params) {
          if (item.params.value === route.params.value) return true;
          else return false;
        } else {
          return true;
        }
      }
      return false;
    };
    const isAffix = (item: RouteLocationNormalized) => {
      let meta = item.meta as CustomRouteMeta;
      return meta.affix;
    };
    const closeSelectedTag = (tag: RouteLocationNormalized) => {
      var active = isActive(tag);
      store.dispatch("tagsview/delView", tag).then(() => {
        if (active) {
          toLastView(tag);
        }
      });
      //scrollbar.update();
    };

    const toLastView = (view: RouteLocationNormalized) => {
      const latestView = visitedViews.value.slice(-1)[0];
      if (latestView) {
        router.push(latestView.path);
      } else {
        // now the default is to redirect to the home page if there is no tags-view,
        // you can adjust it according to your needs.
        if (view.name === "Dashboard") {
          // to reload home page
          router.replace({ path: "/redirect" + view.path });
        } else {
          router.push("/");
        }
      }
    };
    const refresh = () => {
      location.reload();
    };
    const handleDropdownCommand = (command: string) => {
      // Handle the dropdown commands here
      if (command === "closeCurrent") {
        closeCurrent();
      } else if (command === "closeOther") {
        closeOther();
      } else if (command === "closeAll") {
        closeAll();
      }
    };
    const closeCurrent = () => {
      var tag = route;
      var active = isActive(tag);
      store.dispatch("tagsview/delView", tag).then(() => {
        if (active) {
          toLastView(tag);
        }
      });
      //this.$refs.scrollbar.update();
      scrollbarRef.value?.setScrollTop(scrollleft.value);
    };
    const closeOther = () => {
      var tag = route;
      store.dispatch("tagsview/delOthersViews", tag).then(() => {
        toLastView(tag);
      });
      //this.$refs.scrollbar.update();
      scrollbarRef.value?.setScrollTop(scrollleft.value);
    };
    const closeAll = () => {
      var view = route;
      store.dispatch("tagsview/delAllViews").then(() => {
        // if (affixTags.some((tag) => tag.path === view.path)) {
        //   return;
        // }
        toLastView(view);
      });
    };
    const scroll = (scrollLeft: number) => {
      scrollleft.value = scrollLeft;
    };
    // Watch for changes in the route object
    watch(
      () => router.currentRoute.value,
      () => {
        addTag();
      }
    );
    onMounted(() => {
      const routes = router.getRoutes();

      for (const tag of routes) {
        if (tag.meta?.affix == true) {
          store.dispatch("tagsview/addView", tag);
        }
      }
      addTag();
    });
    const titleAdditional = (tag: any) => {
      if (tag.params === undefined) return "";
      if (tag.params === null) return "";
      if (tag.params.label === undefined) return "";
      if (tag.params.label === null) return "";

      return "_" + decodeURIComponent(tag.params?.label);
    };
    return {
      visitedViews,
      move,
      isActive,
      isAffix,
      closeSelectedTag,
      refresh,
      handleDropdownCommand,
      scroll,
      titleAdditional,
    };
  },
});
</script>
<style lang="scss" scoped></style>
