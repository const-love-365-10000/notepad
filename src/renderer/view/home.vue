<template>
  <div @mousedown="appMousedown">
    <app-header :title="appHeaderTitle" style=""></app-header>

    <div class="main">
      <app-left-menu
        ref="leftMenu"
        :show="showLeftMenu"
        @openFile="openFile"
      ></app-left-menu>
      <div class="editorBox">
        <div
          style="
            width: 100%;
            height: calc(100vh - 70px - 2.5rem);
            display: flex;
          "
        >
          <div class="writeHelpBar">
            <span
              ><i
                class="ri-paragraph"
                style="position: relative; cursor: pointer"
                :style="{ top: writeTipOffsetTop + 'px' }"
              ></i
            ></span>
          </div>
          <div
            contenteditable="true"
            class="editor"
            id="editor"
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
            @keydown.enter="translate"
          >
            <p id="focus" style="width: 100%; height: 1.5rem"></p>
            <span v-if="showPlaceholder" style="color: rgba(0, 0, 0, 0.8)"
              >记事吧...</span
            >
          </div>
        </div>

        <app-footer :count="writeWords"></app-footer>

        <input-modal
          v-if="false"
          class="inputModal"
          :title="'新建文件'"
          :placeholder="'名称'"
        ></input-modal>
      </div>
    </div>
  </div>
</template>
<script>
const { dialog } = require("electron").remote;
const fs = require("fs");
import { translateToHtml, translateToMd } from "@/util/translate.js";
import $ from "jquery";
import marked from "marked";
import turndown from "turndown";
var turndownService = new turndown();
import dompurify from "dompurify";
import AppHeader from "@/components/Header/Header.vue";
import AppFooter from "@/components/Footer/Footer.vue";
import AppLeftMenu from "@/components/LeftMenu/LeftMenu.vue";
import InputModal from "@/components/inputModal/inputModal.vue";

let ipcRenderer = require("electron").ipcRenderer;

export default {
  name: "Home",
  components: { AppHeader, AppFooter, AppLeftMenu, InputModal },
  data() {
    return {
      showLeftMenu: false,
      appHeaderTitle: "未命名-1",
      showPlaceholder: true,
      writeTipOffsetTop: 16,
      writeWords: {
        char: 0,
        paragraph: 0,
        word: 0,
      },
      editorHtml: null,
      selection: null,
    };
  },
  computed: {
    // editorHtml() {
    //   console.log(this.$refs.editor);
    //   // if (this.$refs.editor) {
    //   return this.$refs.editor || null;
    //   // }
    // },
  },
  created() {
    window.addEventListener("keydown", this.handleSaveFile, true);

    // model change
    this.$on("changeModel", function (val) {
      console.log(val);
      if (val === 0) {
        this.showLeftMenu = false;
        // ipcRenderer.send("changWindowSize", [400, 370]);
        ipcRenderer.send("changWindowSize", [800, 600]);
      } else if (val === 1) {
        this.showLeftMenu = true;
        ipcRenderer.send("changWindowSize", [1004, 710]);
      }
    });
  },
  methods: {
    editorChange(e) {
      this.editorHtml = this.$refs.editor.innerHTML;
      this.$store.dispatch("setEditorHtml", this.$refs.editor.innerHTML);

      //  统计数字
      // this.writeWords = this.$refs.editor.innerText.length;
      let countChar = 0;
      let countParagraph = 0;
      let text = this.$refs.editor.innerText;

      for (let i in this.$refs.editor.innerText) {
        if (/[0-9a-zA-Z\u4e00-\u9fa5]/g.test(text.charAt(i))) {
          countChar++;
        }
        if (/\n/g.test(text.charAt(i))) {
          countParagraph++;
        }
      }
      this.writeWords.char = countChar;
      this.writeWords.paragraph = countParagraph;
      console.log(text.match(/\s/g), text.match(/\r\n/g));
      // this.writeWords.word =
      //   text.match(/\s/g).length + text.match(/\n/g).length;

      // 编辑器逻辑
      // console.log(e);
      let selection = document.getSelection();
      // let range = selection.getRangeAt(0);
      // this.selection = selection;
      // this.range = selection.getRangeAt(0);
      // console.log(selection, this.range);

      // range.surroundContents(document.createElement("p"));

      // selection.focusNode.data = marked(selection.focusNode.nodeValue);

      // console.log(
      //   selection.baseNode,
      //   e.target.children[e.target.children.length - 1].offsetTop
      // );
      this.writeTipOffsetTop = selection.baseNode
        ? selection.baseNode.offsetTop - 72
        : selection.baseNode.parentNode.offsetTop;
      // this.writeTipOffsetTop =
      //   this.focusNode.parentNode.offsetTo - 70 > 0
      //     ? Math.abs(this.focusNode.parentNode.offsetTop)
      //     : 22;
      // if (selection.baseNode.offsetTop) {
      //   //   // 回车点击的时候
      //   //   this.writeTipOffsetTop =
      //   //     selection.baseNode.offsetTop - 32 > 0
      //   //       ? selection.baseNode.offsetTop - 70
      //   //       : 12;

      //   this.writeTipOffsetTop = selection.baseNode.offsetTop - 16 * 3 > 0;
      // } else {
      //   // 输入的时候
      //   this.writeTipOffsetTop = selection.baseNode.parentNode.offsetTop - 16;
      // }

      console.log(selection);

      // if (
      //   selection.anchorNode.parentNode &&
      //   selection.anchorNode.parentNode.offsetTop
      // ) {
      //   console.log(selection.anchorNode.parentNode.offsetTop);
      //   this.writeTipOffsetTop = selection.anchorNode.parentNode.offsetTop - 30;
      // }
    },
    editorClick(e) {
      // markdown
      let selection = document.getSelection();
      let range = selection.getRangeAt(0);

      console.log("84", selection);
      console.log(turndownService.turndown(e.target.innerHTML));
      // if (e.target.innerHTML && e.target.id.indexOf("#") !== -1) {
      //   // e.target.innerHTML = turndownService.turndown(e.target.innerHTML);
      //   e.target.innerHTML = e.target.id;

      //   range.setStart(selection.baseNode, e.target.id.length);
      //   range.setEnd(selection.baseNode, e.target.id.length);
      //   // e.target.innerHTML = "<em>555</em>";
      // } else {
      // }

      // 左侧光标工具显示

      console.log(e.target.offsetTop);
      this.writeTipOffsetTop =
        e.target.offsetTop - 70 > 0 ? Math.abs(e.target.offsetTop - 70) : 22;
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
      // bug太多，暂时禁用
      // if (
      //   (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) &&
      //   (e.key === "S" || e.key === "s")
      // ) {
      //   dialog.showSaveDialog(
      //     {
      //       title: "保存文件",
      //       defaultPath: "./" + this.appHeaderTitle,
      //       nameFieldLabel: this.appHeaderTitle,
      //       properties: ["createDirectory", "showOverwriteConfirmation"],
      //       filters: [
      //         { name: "markdown", extensions: ["md"] },
      //         { name: "txt", extensions: ["txt"] },
      //         { name: "html", extensions: ["html"] },
      //       ],
      //     },
      //     (res) => {
      //       let saveFile = res;
      //       console.log(saveFile);
      //       console.log(this);
      //       if (!res) {
      //         return;
      //       }
      //       if (/\.md/.exec(saveFile)) {
      //         this.appHeaderTitle = /\\{1}.{0,12}\.md$/
      //           .exec(saveFile)[0]
      //           .replace(/\\/, "");
      //         let file = fs.writeFile(
      //           saveFile,
      //           this.$refs.editor.innerText,
      //           function (err) {
      //             if (err) {
      //               console.error(err);
      //             }
      //           }
      //         );
      //       } else if (saveFile.toString().indexOf(".html") !== -1) {
      //         this.appHeaderTitle = /\\{1}.{0,12}\.html$/
      //           .exec(saveFile)[0]
      //           .replace(/\\/, "");
      //         console.log(saveFile);
      //         let file = fs.writeFile(
      //           saveFile,
      //           this.$refs.editor.innerHTML,
      //           function (err) {
      //             if (err) {
      //               console.error(err);
      //             }
      //           }
      //         );
      //       }
      //     }
      //   );
      //   return;
      // } else {
      //   return;
      // }
    },
    openFile(fileContent) {
      // 打开md
      this.$refs.editor.innerHTML = fileContent;
      // 打开h5
      // this.$refs.editor.innerText = fileContent;
    },
    appMousedown(e) {
      console.log("appMousedown");
      this.$refs.leftMenu.notifyRightClickMenu(e);
    },
    translate(e) {
      e.preventDefault();

      function insterAfter(newElement, targetElement) {
        let parent = targetElement.parentNode;
        if (parent.lastChild.isEqualNode(targetElement)) {
          parent.appendChild(newElement);
        } else {
          parent.insertBefore(newElement, targetElement.nextSibling);
        }
      }
      console.log($("#editor"));
      // 简约模式不进行md翻译
      if (this.$store.state.global.model === 0) {
        return;
      }

      let selection = document.getSelection();

      // console.log("id", selection.baseNode.nodeType);
      // if (
      //   selection.baseNode.nodeType !== 3 ||
      //   (selection.baseNode.parentNode.nodeType !== 3 &&
      //     selection.baseNode.parentNode.id)
      // ) {
      //   // 已经是元素节点，没必要再翻译
      //   console.log("已经是元素节点，没必要再翻译");
      //   console.log(654, selection.baseNode.parentElementNode);
      //   return;
      // }

      console.log(555, selection.baseNode.nodeValue.match(/\#{1,6}/g));
      // selection.baseNode.innerHTML = marked(this.selection.baseNode.innerText);
      let range = selection.getRangeAt(0);

      // 根据#的个数判断h标题
      let header = "";
      try {
        let arr = selection.baseNode.nodeValue.match(/\#/g);
        for (let i = 0; i < arr.length; i++) {
          header += "#";
          if (i === arr.length - 1) {
            header += " ";
          }
        }
      } catch (err) {}

      console.log("111111111", selection);

      console.log(selection);
      // if (selection.baseNode.nodeType === 1) {
      //   selection.baseNode.innerHTML = marked(selection.baseNode.nodeValue, {
      //     headerPrefix: header,
      //   });
      //   console.log("我是1");
      // } else {
      let newEl = document.createElement("div");
      let focus = document.getElementById("focus");
      newEl.className = "clean";
      newEl.innerHTML = marked(selection.baseNode.nodeValue, {
        headerPrefix: header,
      });
      console.log(newEl.innerHTML);
      // range.insertNode(newEl);

      // if (!selection.baseNode.parentElement.id) {
      //   selection.baseNode.parentElement.parentElement.insertBefore(
      //     newEl,
      //     selection.baseNode.parentElement
      //   );
      // } else {

      // selection.baseNode.parentNode.removeChild(selection.baseNode);

      // document.getElementById("focus").innerText = "";
      // range.setStart(this.$refs.editor, 2);
      // range.setEnd(this.$refs.editor, 2);
      if (
        (selection.baseNode.nodeType === 1 &&
          selection.baseNode.isEqualNode(focus)) ||
        selection.baseNode.parentElement === focus
      ) {
        console.log("我是1");
        this.$refs.editor.insertBefore(newEl, focus);
        selection.baseNode.parentNode.removeChild(selection.baseNode);
        range.selectNodeContents(focus);
      } else {
        console.log("我是2");
        let div = document.createElement("div");
        div.className = "clean";
        this.$refs.editor.insertBefore(
          div,
          selection.baseNode.parentElement.parentElement.nextElementSibling
        );
        range.selectNodeContents(div);
      }
      // }
    },
  },
  watch: {},
};
</script>

<style lang="scss" >
.main {
  display: flex;
}
.editor {
  // 100vh - paddingTop - headerHeight - footerHeight
  min-height: calc(100vh - 1em - 2rem - 2.5rem);
  width: calc(100vw - 2rem);
  outline: none;
  padding: 1em 2rem 0 0;
  font-size: 1.2rem;
  color: #455;
  font-weight: 300;
  word-break: break-all;
  overflow-y: auto;

  // background: url("/static/img/write.svg") no-repeat;

  &::selection {
    background-color: #dddddd;
  }
  & *::selection {
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
  display: flex;
  justify-content: center;

  width: 2rem;
}
.editorBox {
  overflow-y: hidden;
  overflow-x: hidden;
  height: 100%;
  background: #f7f7f7;
  width: 100%;
  display: flex;
  flex-direction: column;
}

.editor {
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

.inputModal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 280px;
  height: 70px;
  display: flex;
  justify-content: center;
  background: #263238;
  box-shadow: 0 0 5px 2px #eee;
  border-radius: 3px;
}

#editor {
  p {
    white-space: pre-wrap;
  }
  p,
  div {
    width: 100%;
    min-height: 1.5rem;
  }
  .clean {
    // outline: none;
    border: none;
  }
}
</style>