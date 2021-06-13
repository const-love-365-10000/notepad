<template>
  <div class="footer">
    <div class="footerToolbar"><i class="far fa-file-word"></i></div>

    <div class="words">{{ words }}</div>
  </div>
</template>

<script>
export default {
  name: "AppFooter",
  props: ["words"],
  data() {
    return {};
  },
};
</script>

<style lang="scss">
@import "Footer.scss";

// header {
//   width: 100%;
//   height: 50px;
// }
</style>