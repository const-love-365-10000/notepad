<template>
  <div v-if="isShow">
    <div class="modal">
      <div class="ordinaryModal">
        <div class="modalHeader">
          <i
            class="fas"
            :class="typeIcon"
            style="color: #2d8cf0; margin-right: 5px"
          ></i
          >{{ title }}
        </div>
        <div class="modalBody">{{ text }}</div>
        <div class="modalButton">
          <button
            v-for="(i, index) in buttons"
            :key="i"
            @click="clickButton(index)"
          >
            {{ i }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ordinaryModal",
  data() {
    return {
      isShow: false,
      type: "info",
      title: "",
      text: "",
      buttons: [],
      buttonEvent: null,
      index: 0, // 点击按钮的索引
    };
  },
  computed: {
    typeIcon() {
      if (this.type === "info") {
        return "fa-info-circle";
      } else {
        return "fa-info-circle";
      }
    },
  },
  methods: {
    show(
      type = "info",
      title = "对话框",
      text = "",
      buttons = ["确定"],
      buttonEvent = null
    ) {
      this.isShow = true;
      this.type = type;
      this.title = title;
      this.text = text;
      this.buttons = buttons;
      this.buttonEvent = buttonEvent;
    },
    close() {
      this.isShow = false;
    },
    clickButton(index) {
      this.index = index;
      if (this.buttonEvent) {
        if (typeof this.buttonEvent[index] === "function") {
          this.buttonEvent[index]();
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 5px 3px #f3f3f1;

  .ordinaryModal {
    min-width: 40vw;
    min-height: 22vh;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: white;
    border-radius: 6px;
    padding: 2em;

    .modalHeader {
      font-weight: 600;
      font-size: 21px;
      color: #17233d;
    }

    .modalButton {
      display: flex;
      justify-content: flex-end;

      button {
        outline: none;
        border: none;
        cursor: pointer;
        color: white;
        position: relative;
        // padding: 0.5em 1em;
        background-color: #2d8cf0;
        font-size: 0.8rem;
        width: 5em;
        height: 2.5em;

        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;

        z-index: 1;
        overflow: hidden;

        margin: 0 0.8em;

        &:last-child {
          margin-right: 0;
        }
      }

      //   button::before {
      //     z-index: -1;
      //     content: "";
      //     position: absolute;
      //     top: 50%;
      //     left: 50%;
      //     width: 1em;
      //     height: 1em;
      //     border-radius: 50%;
      //     // background-color: #9254de;
      //     background-color: #5ba2ee;
      //     transform-origin: center;
      //     transform: translate3d(-50%, -50%, 0) scale(0, 0);
      //     transition: transform 0.45s ease-in-out;
      //   }

      //   button:hover::before {
      //     transform: translate3d(-50%, -50%, 0) scale(15, 15);
      //   }
    }
  }
}
</style>