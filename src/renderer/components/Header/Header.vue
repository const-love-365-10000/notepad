<template>
  <div class="header">
    <div class="menuBox">
      <i class="ri-list-unordered"></i>
    </div>
    <i class="ri-markdown-fill app-header-logo"></i>

    <div>{{ title }}</div>

    <div class="controlMenu">
      <i class="ri-subtract-line" @click="minimize"></i>
      <i
        class=""
        :class="isMax ? 'ri-picture-in-picture-line' : 'ri-aspect-ratio-line'"
        @click="restore"
      ></i>
      <i class="ri-close-fill" @click="close"></i>
    </div>
  </div>
</template>

<script>
let ipcRenderer = require("electron").ipcRenderer;

export default {
  name: "AppHeader",
  props: ["title"],
  data() {
    return { isMax: false };
  },
  methods: {
    minimize() {
      //发送最大化命令
      ipcRenderer.send("window-min");
    },
    restore() {
      ipcRenderer.send("window-max");

      this.isMax = !this.isMax;
    },
    close() {
      this.$modal.show(
        "info",
        "警告",
        "是否要保存文件",
        ["保存", "不保存", "取消"],
        [
          () => {
            console.log("哈哈哈");
          },
          () => {
            ipcRenderer.send("window-close");
          },
          () => {
            this.$modal.close();
          },
        ]
      );
    },
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