<template>
  <div class="header">
    <div class="menuBox"><i class="fas fa-align-justify"></i></div>
    <i class="fab fa-markdown app-header-logo"></i>

    <div>{{ title }}</div>

    <div class="controlMenu">
      <i class="fas fa-window-minimize minimize" @click="minimize"></i>
      <i
        class="far"
        :class="isMax ? 'fa-window-restore' : 'fa-window-maximize'"
        @click="restore"
      ></i>
      <i class="fas fa-window-close" @click="close"></i>
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
      ipcRenderer.send("window-close");
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