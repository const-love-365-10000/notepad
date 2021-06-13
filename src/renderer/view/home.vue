<template>
  <div>
    <app-header :title="appHeaderTitle" style=""></app-header>
    <div class="editorBox">
      <div class="writeHelpBar">
        <span
          ><i
            class="fas fa-paragraph"
            style="position: relative"
            :style="{ top: writeTipOffsetTop + 'px' }"
          ></i
        ></span>
      </div>
      <div
        contenteditable="true"
        id="editor"
        class="editor"
        ref="editor"
        @focus="editorFocus"
        @blur="editorBlur"
        @input="editorChange"
        @click="editorClick"
        @keydown.ctrl.49="execCommand('formatBlock', 'H1')"
        @keydown.ctrl.50="execCommand('formatBlock', 'H2')"
        @keydown.ctrl.51="execCommand('formatBlock', 'H3')"
        @keydown.ctrl.52="execCommand('formatBlock', 'H4')"
        @keydown.ctrl.53="execCommand('formatBlock', 'H5')"
        @keydown.ctrl.54="execCommand('formatBlock', 'H6')"
      >
        <span v-if="showPlaceholder" style="color: rgba(0, 0, 0, 0.8)"
          >记事吧...</span
        >
      </div>
    </div>
    <app-footer :words="writeWords"></app-footer>
  </div>
</template>
<script>
const { dialog } = require("electron").remote;
const fs = require("fs");
import AppHeader from "@/components/Header/Header.vue";
import AppFooter from "@/components/Footer/Footer.vue";

export default {
  name: "Home",
  components: { AppHeader, AppFooter },
  data() {
    return {
      appHeaderTitle: "未命名-1",
      showPlaceholder: true,
      writeTipOffsetTop: 22,
      writeWords: 0,
    };
  },
  created() {
    window.addEventListener("keydown", this.handleSaveFile, true);
  },
  methods: {
    editorChange(e) {
      this.writeWords = this.$refs.editor.innerText.length;

      let selection = document.getSelection();

      console.log(selection);

      if (selection.baseNode.offsetTop) {
        this.writeTipOffsetTop =
          selection.baseNode.offsetTop - 32 > 0
            ? selection.baseNode.offsetTop - 30
            : 22;
      } else {
        this.writeTipOffsetTop =
          selection.baseNode.parentNode.offsetTop - 32 > 0
            ? selection.baseNode.parentNode.offsetTop - 30
            : 22;
      }

      // if (
      //   selection.anchorNode.parentNode &&
      //   selection.anchorNode.parentNode.offsetTop
      // ) {
      //   console.log(selection.anchorNode.parentNode.offsetTop);
      //   this.writeTipOffsetTop = selection.anchorNode.parentNode.offsetTop - 30;
      // }
    },
    editorClick() {
      // 左侧光标工具显示
      let selection = document.getSelection();
      if (selection.baseNode.offsetTop) {
        this.writeTipOffsetTop =
          selection.baseNode.offsetTop - 32 > 0
            ? selection.baseNode.offsetTop - 30
            : 22;
      } else {
        this.writeTipOffsetTop =
          selection.baseNode.parentNode.offsetTop - 32 > 0
            ? selection.baseNode.parentNode.offsetTop - 30
            : 22;
      }
    },
    editorFocus() {
      // 隐藏Placeholder
      this.showPlaceholder = false;

      // // let range = document.getSelection().getRangeAt(0) || null;

      // if (selection.anchorNode && selection.anchorNode.parentNode.offsetTop) {
      //   console.log(selection);
      //   console.log(selection.anchorNode.parentNode.offsetTop);
      //   this.writeTipOffsetTop = selection.anchorNode.parentNode.offsetTop;
      // }

      // // console.log(range);

      // // this.writeTipOffsetTop =
      // //   selection.commonAncestorContainer.parentNode.offsetTop;
    },
    editorBlur() {
      if (this.$refs.editor.innerText.length === 0) {
        this.showPlaceholder = true;
      }
    },
    execCommand(name, extra = undefined) {
      let selection = document.getSelection();
      let range = selection.getRangeAt(0);
      let parentNode = range.commonAncestorContainer.parentNode;
      // console.log(JSON.stringify(parentNode));
      console.log(parentNode.tagName.toString());
      console.log(extra);
      if (parentNode.tagName.toString() === extra) {
        // selection.removeRange(range);
        // parentNode.remove();
        document.execCommand(name, undefined, "p");
      } else {
        document.execCommand(name, undefined, extra);
      }
    },

    handleSaveFile(e) {
      if (
        (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
        (e.key === "S" || e.key === "s")
      ) {
        let saveFile = dialog.showSaveDialog({
          title: "保存文件",
          defaultPath: this.appHeaderTitle,
          nameFieldLabel: this.appHeaderTitle,
          properties: ["createDirectory", "showOverwriteConfirmation"],
          filters: [
            { name: "markdown", extensions: ["md"] },
            { name: "html", extensions: ["html"] },
          ],
        });

        // have save
        if (saveFile) {
          console.log(saveFile);
          if (/\.md/.exec(saveFile)) {
            this.appHeaderTitle = /\\{1}.{0,12}\.md$/
              .exec(saveFile)[0]
              .replace(/\\/, "");

            let file = fs.writeFile(
              saveFile,
              this.$refs.editor.innerText,
              function (err) {
                if (err) {
                  console.error(err);
                }
              }
            );
          } else if (/\.html/.exec(saveFile)) {
            this.appHeaderTitle = /\\{1}.{0,12}\.html$/
              .exec(saveFile)[0]
              .replace(/\\/, "");

            let file = fs.writeFile(
              saveFile,
              this.$refs.editor.innerHTML,
              function (err) {
                if (err) {
                  console.error(err);
                }
              }
            );
          }

          // .replace(/\.*md/, "");
        }
        return;
      }
    },
  },
};
</script>

<style lang="scss" >
.editor {
  // 100vh - paddingTop - headerHeight - footerHeight
  min-height: calc(100vh - 1em - 2rem - 1.5rem);
  width: 100%;
  outline: none;
  padding: 1em 2rem 0 0;
  font-size: 1.2rem;
  color: #455;
  font-weight: 300;
  word-break: break-all;

  // background: url("/static/img/write.svg") no-repeat;

  &::selection {
    background-color: #dddddd;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #535759;
  }
}

.writeHelpBar {
  width: 2rem;
}
.editorBox {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  background: #f7f7f7;
  width: 100%;
  display: flex;

  /*滚动条整体部分,必须要设置 , 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  /*滚动条的轨道*/
  /* body::-webkit-scrollbar-track {
  background: #f5f5f5;
} */

  /*滚动条的轨道*/
  &::-webkit-scrollbar-track {
    // border-radius: 10px;
    // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    // background: #dcdcdc;
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    height: 5px;
    // background-color: #535353;
    background: #dbdcdc;
    border-radius: 5px;
  }

  /*滚动条的上下两端的按钮*/
  &::-webkit-scrollbar-button {
    height: 0;
    background-color: #0e2531;
  }

  /*滚动条交叉地方的样式*/
  &::-webkit-scrollbar-corner {
    background-color: #0e2531;
  }
}
</style>