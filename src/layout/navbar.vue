<template>
  <div class="navbardiv">
    <el-space>
      <el-button class="el-button-icon" type="primary" @click="toggleSideBar">
        <el-icon :size="25" color="#909399">
          <Fold v-if="sidebarOpened" />
          <Expand v-else />
        </el-icon>
      </el-button>

      <el-breadcrumb class="breadcrumb" separator-icon="ArrowRight">
        <transition-group name="breadcrumbtransition">
          <el-breadcrumb-item
            v-for="(item, index) in breadList"
            :key="item.path"
          >
            <span
              v-if="item.redirect === '' || index == breadList.length - 1"
              class="no-redirect"
              >{{ item.meta.title }}</span
            >
            <a v-else @click.prevent="handleLink(item)">{{
              item.meta.title
            }}</a>
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </el-space>
    <div></div>
    <el-space>
      <el-tooltip :content="popoverFullScreen" placement="bottom">
        <el-button
          class="el-button-icon"
          type="primary"
          @click="toggleFullScreen"
        >
          <el-icon :size="25" color="#909399">
            <FullScreen />
          </el-icon>
        </el-button>
      </el-tooltip>

      <el-popover placement="bottom" :width="400" trigger="click">
        <template #reference>
          <el-badge :is-dot="badgeCount > 0" type="warning">
            <el-button class="el-button-icon" type="primary">
              <el-icon :size="25" color="#909399">
                <Bell />
              </el-icon>
            </el-button>
          </el-badge>
        </template>
      </el-popover>

      <el-dropdown>
        <el-button class="el-button-icon" type="primary">
          <el-avatar :src="avatarUrl" shape="square" :size="32"></el-avatar>
          <span style="margin-left: 5px; color: #909399">{{ userName }}</span>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu class="nav-dropdown-menu">
            <el-dropdown-item @click="handleProfile">个人中心</el-dropdown-item>
            <el-dropdown-item divided @click="handleExit"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </el-space>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter, RouteLocationMatched } from "vue-router";
import { useStore } from "vuex";
import zjclogo from "@/assets/zjclogo.png";
import screenfull from "screenfull";

export default defineComponent({
  name: "NavBar",
  components: {},
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    let breadList = ref<RouteLocationMatched[]>([]);
    let badgeCount = ref(1);
    const popoverFullScreen = ref("进入全屏模式");
    const sidebarOpened = computed(() => {
      return store.getters.sidebar;
    });

    const toggleSideBar = () => {
      store.dispatch("app/toggleSideBar");
    };
    const getBreadcrumb = () => {
      breadList.value = route.matched;
    };

    const handleLink = (item: RouteLocationMatched) => {
      console.log(item);
    };

    const toggleFullScreen = () => {
      if (screenfull.isEnabled) {
        screenfull.toggle();

        popoverFullScreen.value = screenfull.isFullscreen
          ? "进入全屏模式"
          : "退出全屏模式";
      }
    };

    const avatarUrl = computed(() => {
      if (store.getters.user) return store.getters.user.AvatarHttp;
      else return "";
    });

    const userName = computed(() => {
      if (store.getters.user) return store.getters.user.UserName;
      else return "";
    });

    const handleProfile = () => {
      router.push({ name: "Profile" });
    };
    const handleExit = () => {
      store.dispatch("user/logout");
      router.push({ name: "LoginIndex" });
    };

    watch(
      () => route,
      () => {
        getBreadcrumb();
      }
    );
    onMounted(() => {
      getBreadcrumb();
    });
    return {
      sidebarOpened,
      breadList,
      badgeCount,
      avatarUrl,
      userName,
      popoverFullScreen,
      toggleSideBar,
      handleLink,
      toggleFullScreen,
      handleProfile,
      handleExit,
      zjclogo,
    };
  },
});
</script>
<style lang="scss" scoped></style>
