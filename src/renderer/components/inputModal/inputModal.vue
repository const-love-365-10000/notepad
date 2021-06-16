<template>
  <div class="inputModal">
    <div class="inputModalHeader">{{ title }}</div>
    <div class="inputModalBody">
      <input :type="type" class="inputText" :placeholder="placeholder" />
      <!-- <input type="button" :value="successText" class="successButton" /> -->
    </div>
  </div>
</template>
<script>
export default {
  name: "inputModal",
  props: {
    title: {
      type: String,
      default: "请输入",
    },
    placeholder: {
      type: String,
      default: "text",
    },
    type: {
      type: String,
      default: "text",
    },
    successText: {
      type: String,
      default: "确定",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.inputModal {
  display: flex;
  flex-direction: column;
  padding: 0 0.5em;
  color: #fff;
  .inputModalHeader {
    font-size: 1.15rem;
  }
  .inputModalBody {
    width: 100%;
  }
  .inputText {
    height: 1.5rem;
    width: 100%;
    border: none;
    margin: 5px 0;
    font-size: 1.05rem;
    background: #4f4f4f;
    outline-color: #f6f6f6;
    color: #fff;
  }
  .successButton {
    width: 50px;
    height: 1.5rem;
    border: none;
    cursor: pointer;
  }
}
</style>