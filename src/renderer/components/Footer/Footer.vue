<template>
  <div class="footer">
    <div
      class="left"
      @mouseenter="modalStyle.color = '#222'"
      @mouseleave="modalStyle.color = '#888'"
      @click="changeModel"
      :style="modalStyle"
    >
      <i
        class="ri-radio-button-line"
        :title="modelIndex === 0 ? '简约模式' : '完全模式'"
      ></i>
    </div>
    <div class="center">{{ nowTime }}</div>
    <div class="right">
      <div
        class="footerToolbar"
        @mouseenter="showCountBox = true"
        @mouseleave="showCountBox = false"
      >
        <i class="ri-file-word-line"> </i>
        <div class="words">{{ count.char }}</div>
      </div>

      <div class="countBox" v-show="showCountBox">
        <div>Character: {{ count.char }}</div>
        <div>Paragraph: {{ count.paragraph }}</div>
        <div>Words: {{ count.word }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppFooter",
  props: {
    count: {
      type: Object,
      default() {
        return {
          word: 0,
          paragraph: 0,
          char: 0,
        };
      },
    },
  },
  data() {
    return {
      nowTime: "",
      showCountBox: false,
      modelIndex: 0, // 0 is simple model, 1 is complete model
      modalStyle: { color: "#888" },
    };
  },
  created() {
    setInterval(() => {
      this.nowTime = new Date().toLocaleString();
    }, 1000);
  },
  methods: {
    changeModel() {
      this.modelIndex = this.modelIndex === 0 ? 1 : 0;
      this.$parent.$emit("changeModel", this.modelIndex);
    },
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