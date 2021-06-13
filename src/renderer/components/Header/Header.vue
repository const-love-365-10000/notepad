<template>
  <div class="header">
    <div class="menuBox"><i class="fas fa-align-justify"></i></div>
    <i class="fab fa-markdown app-header-logo"></i>

    <div>{{ title }}</div>

    <div class="controlMenu">
      <i class="fas fa-window-minimize close"></i>
      <i
        class="far"
        :class="isMax ? 'fa-window-restore' : 'fa-window-maximize'"
      ></i>

      <i class="fas fa-window-close"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppHeader",
  props: ["title"],
  data() {
    return { isMax: false };
  },
};
</script>

<style lang="scss">
@import "Header.scss";

// header {
//   width: 100%;
//   height: 50px;
// }
</style>