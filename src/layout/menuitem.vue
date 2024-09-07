<template>
  <template v-if="hasPurview(item) && isVisible(item)">
    <el-menu-item
      v-if="hasChild(item) == 0"
      :index="resolvePath(basePath, item.path)"
      :key="resolvePath(basePath, item.path)"
    >
      <el-icon>
        <component :is="item.meta?.icon" />
      </el-icon>
      <template #title>
        <span>{{ item.meta?.title }}</span>
      </template>
    </el-menu-item>
    <el-menu-item
      v-if="hasChild(item) == 1"
      :index="resolvePath(item.path, onlyOneChild.path)"
      :key="resolvePath(item.path, onlyOneChild.path)"
    >
      <el-icon>
        <component :is="onlyOneChild.meta?.icon" />
      </el-icon>
      <template #title>
        <span>{{ onlyOneChild.meta?.title }}</span>
      </template>
    </el-menu-item>
    <el-sub-menu
      v-if="hasChild(item) > 1"
      :index="resolvePath(basePath, item.path)"
      :key="resolvePath(basePath, item.path)"
    >
      <template #title>
        <el-icon v-if="item.meta?.icon">
          <component :is="item.meta?.icon" />
        </el-icon>
        <span>{{ item.meta?.title }}</span>
      </template>
      <MenuItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :basePath="resolvePath(basePath, item.path)"
      />
    </el-sub-menu>
  </template>
</template>
<script lang="ts">
import { defineComponent, ref, PropType } from "vue";
import { useRouter, RouteRecordRaw } from "vue-router";
import { CustomRouteMeta } from "@/api/interface";
export default defineComponent({
  name: "MenuItem",

  props: {
    // route object
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },

  setup() {
    const router = useRouter();
    let onlyOneChild = ref<RouteRecordRaw>({ path: "/", redirect: "" });

    const resolvePath = (basePath: string, routePath: string) => {
      if (basePath === "/" || basePath === "") {
        return basePath + routePath;
      } else {
        return basePath + "/" + routePath;
      }
    };

    const isVisible = (item: RouteRecordRaw) => {
      return item.meta?.visible ?? true;
    };
    const hasChild = (parent: RouteRecordRaw) => {
      var count = 0;
      if (parent.children) {
        for (var i = 0; i < parent.children.length; ++i) {
          if (hasPurview(parent.children[i]) && isVisible(parent.children[i])) {
            onlyOneChild.value = parent.children[i];
            count = count + 1;
          }
        }
      }
      return count;
    };

    const isChild = (item: RouteRecordRaw) => {
      var list = router.options.routes;
      for (var i = 0; i < list.length; ++i) {
        if (item.name === list[i].name) return false;
      }
      return true;
    };
    const hasPurview = (item: RouteRecordRaw) => {
      const meta = getMeta(item);
      return meta.purview?.show;
    };
    const getMeta = (item: RouteRecordRaw) => {
      return item.meta as CustomRouteMeta;
    };
    return {
      onlyOneChild,
      hasPurview,
      resolvePath,
      isChild,
      hasChild,
      isVisible,
    };
  },
});
</script>
<style lang="scss" scoped></style>
