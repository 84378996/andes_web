<template>
  <div class="routechilddiv">
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RouteChild",
});
</script>
<style scoped>
.routechilddiv {
  width: 100%;
  height: 100%;
  padding: 0px;
}
</style>
