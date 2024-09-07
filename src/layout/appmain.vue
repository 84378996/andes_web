<template>
  <div class="appmaindiv">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" :key="route.path" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "AppMain",
  setup() {
    const route = useRoute();
    const store = useStore();

    const cachedViews = computed(() => {
      //解决刷新后，cachedviews被清空，不能正常缓存的问题。
      if (store.getters.cachedViews.length === 0)
        store.dispatch("tagsview/addCachedView", route);
      return store.getters.cachedViews;
    });

    return {
      route,
      cachedViews,
    };
  },
});
</script>
<style lang="scss" scoped>
.appmaindiv {
  width: 100%;
  height: 100%;
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.28s;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
  /* fade-transform */
  .fade-transform-leave-active,
  .fade-transform-enter-active {
    transition: all 0.5s;
  }

  .fade-transform-enter {
    opacity: 0;
    transform: translateX(-30px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }
}
.scrollbar {
  height: 100%;
  width: 100%;
  background-color: #f5f7f9;
}
</style>
