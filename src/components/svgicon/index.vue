<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-bind="$attrs"
  ></div>

  <svg v-else :class="svgClass" aria-hidden="true" v-bind="$attrs">
    <use :href="iconName" />
  </svg>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    isExternal() {
      //支持从外部网址导入svg。

      //return isExternal(this.iconClass);
      return /^(https?:|mailto:|tel:)/.test(this.iconClass);
    },
    iconName() {
      return `#icon-${this.iconClass}`;
    },
    svgClass() {
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
    styleExternalIcon() {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      };
    },
  },
});
</script>
<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
