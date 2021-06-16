<template>
  <div class="leftMenu" :style="{ width: show ? '400px' : '0' }">
    <div class="menu">
      <ul>
        <li><i class="fas fa-folder"></i></li>
        <li><i class="fas fa-search"></i></li>
        <li><i class="fas fa-project-diagram"></i></li>
        <li><i class="fas fa-code-branch"></i></li>
      </ul>
    </div>
    <div class="fileBox">
      <div class="fileBoxHeader">
        <div @click="changeFileModel('file')">目录</div>
        <div @click="changeFileModel('outline')">大纲</div>
      </div>
      <div class="fileBoxBody">
        <ul
          class="fileModel"
          :class="showFileModel ? 'fadeIn' : ''"
          v-show="showFileModel"
          @mousedown="fileListMousedown"
        >
          <li
            v-for="(i, index) in fileList"
            :key="i.name"
            :data-index="index"
            class="fileItem"
            @click="openFile(i)"
            :title="i.name"
          >
            <i
              :class="i.icon"
              :style="{ color: i.color }"
              style="margin: 0 5px"
            ></i>
            {{ i.name }}
          </li>
          <li class="fileItem inputFileName" v-if="newFile">
            <i class="fas" :class="newFile.icon" style="margin: 0 5px"></i>
            <input
              type="text"
              class="inputText"
              v-model="newFileName"
              autofocus="autofocus"
              :placeholder="'名称'"
              @keypress.enter="createFile"
            />
          </li>
        </ul>
        <ul
          class="outlineModel"
          :class="!showFileModel ? 'fadeIn' : ''"
          v-show="!showFileModel"
        >
          <li
            v-for="i in outlineList"
            :key="i.input"
            :class="'outlineItem' + '-' + i.tagName"
          >
            {{ i.text }}
          </li>
        </ul>
      </div>
    </div>
    <right-click-menu
      class="RightClickMenu"
      v-show="fileListRightMenuShow"
      :buttons="RightClickMenuButtons"
      :style="{
        left: fileListRightMenuPosition.x + 'px',
        top: fileListRightMenuPosition.y + 'px',
      }"
    ></right-click-menu>
  </div>
</template>
<script>
const fs = require("fs");

import { openFile } from "@/util/openFile.js";
import rightClickMenu from "@/components/rightClickMenu/rightClickMenu";
let ipcRenderer = require("electron").ipcRenderer;
const Electron = require("electron");
const remote = Electron.remote;
const Menu = remote.Menu;
const MenuItem = remote.MenuItem;

export default {
  name: "AppLeftMenu",
  props: {
    show: {
      type: Boolean,
    },
    editorHtml: {
      default: null,
    },
  },
  components: { rightClickMenu },
  data() {
    return {
      fileList: [],
      showFileModel: true, // 控制目录和大纲的显示
      outlineList: null,
      fileModel: true, // true is  file or false is outline
      filePath: "./",
      RightClickMenuButtons: [
        { name: "打开", value: 0 },
        { name: "新建", value: 1 },
        { name: "删除", value: 2 },
      ],
      fileListRightMenuShow: false,
      fileListRightMenuPosition: { x: 0, y: 0 },

      menu: null,
      rightMessage: null,
      newFileName: "",
      newFile: null,
      fileListRightItems: [
        new MenuItem({
          label: "新建文件",
          type: "normal",
          role: "fileMenu",
          click: (e, focusedWindow, focusedWebContents) => {
            this.newFile = {};
            this.newFile.type = "file";
            this.newFile.icon = "fa-file";
            this.newFile.filePath = this.$store.state.global.filePath;
          },
        }),
        new MenuItem({
          label: "新建目录",
          role: "fileMenu",
          click: (e, focusedWindow, focusedWebContents) => {
            console.log(e, focusedWindow, focusedWebContents);
          },
        }),
        new MenuItem({
          label: "复制",
          role: "copy",
          click: () => {},
        }),
        new MenuItem({
          label: "剪切",
          role: "cut",
          click: () => {},
        }),
        new MenuItem({
          label: "粘贴",
          role: "paste",
          click: () => {},
        }),

        new MenuItem({
          label: "删除",
          role: "fileMenu",
          type: "normal",
          click: (e) => {
            ipcRenderer.send("fileMenu", {
              type: "delete",
              event: this.rightMessage,
            });
          },
        }),
      ],
    };
  },
  computed: {},
  created() {
    // 初始化文件列表右键次啊单
    this.initMenu();

    // 监听主进程——更新文件列表
    ipcRenderer.on("updateFileList", (e, res) => {
      console.log(e, res);
      if (res && res.type === "createFileSuccess") {
        this.newFile = null;
        this.newFileName = "";
      }
      this.handleFile(this.$store.state.global.filePath);
    });

    // watch.watchTree(this.$store.state.global.filePath, (f, curr, prev) => {
    //   if (typeof f == "object" && prev === null && curr === null) {
    //     // Finished walking the tree
    //     console.log("watchTree");
    //   } else if (prev === null) {
    //     // f is a new file
    //   } else if (curr.nlink === 0) {
    //     // f was removed
    //     console.log("删除了987");
    //   } else {
    //     // f was changed
    //   }
    // });

    // get目录列表
    // this.fileList = fs.readdirSync("./", { withFileTypes: true });
    this.handleFile(this.filePath);
  },
  methods: {
    initMenu() {
      this.menu = new Menu();
      // for(let i of this.fileListRightItems){
      //   this.mu
      // }
      this.menu = Menu.buildFromTemplate(this.fileListRightItems);
      // this.menu.setApplicationMenu(this.fileListRightItems);
    },

    // 显示右键菜单
    rightShow(item) {
      this.rightMessage = item;
      this.menu.popup(remote.getCurrentWindow());
    },

    handleFile(path) {
      fs.readdir(path, { withFileTypes: true }, (err, data) => {
        if (err) {
          console.error(err);
          return;
        }
        // console.log(data);
        let fileList = data;

        // console.log(fs.statSync("./" + this.fileList[0]).isDirectory());
        for (let i in fileList) {
          let fileInfo = fs.statSync(path + fileList[i]);
          if (fileInfo.isDirectory()) {
            fileList[i] = {
              name: fileList[i],
              type: "dir",
              icon: "ri-folder-fill",
              color: "#dcb67a",
            };
          } else if (fileInfo.isFile()) {
            console.log(fileList[i]);
            if (fileList[i].match(/\.html$/)) {
              fileList[i] = {
                name: fileList[i],
                type: "file",
                icon: "ri-html5-line",
                color: "#e44f26",
              };
            } else if (fileList[i].match(/\.txt$/)) {
              fileList[i] = {
                name: fileList[i],
                type: "file",
                icon: "ri-file-text-fill",
                color: "#40a57f",
              };
            } else if (fileList[i].match(/\.md$/)) {
              fileList[i] = {
                name: fileList[i],
                type: "file",
                icon: "ri-markdown-fill",
                color: "#53b5e7",
              };
            } else {
              fileList[i] = {
                name: fileList[i],
                type: "file",
                icon: "ri-file-fill",
                color: "#222",
              };
            }
          } else {
            fileList[i] = {
              name: fileList[i],
              type: "unknown",
              icon: "fa-sticky-note",
            };
          }
          // console.log(fileList[i]);
          // this.fileList.push(fileList[i]);
        }
        // 判断当前所在目录，增加../返回上目录
        console.log(this.filePath);
        if (this.filePath.match(/\//g).length > 1) {
          fileList.unshift({
            name: "../",
            icon: "fa-folder-open",
            type: "dir",
          });
        } else {
          if (fileList[0].name === "../") {
            fileList.shift();
          }
        }
        this.fileList = fileList;
        console.log(fileList);
      });
    },
    handleOutline() {
      let matchDOM = JSON.stringify(this.$store.state.global.editorHtml).match(
        /\<h[1-6]{1}\>.*?\<\/h[1-6]\>/g
      );
      // console.log(this.$store.state.global.editorHtml);
      console.log(
        JSON.stringify(this.$store.state.global.editorHtml).match(
          /\<h[1-6]{1}\>.*?\<\/h[1-6]\>/g
        )
      );

      for (let i in matchDOM) {
        matchDOM[i] = {
          input: matchDOM[i],
          text: matchDOM[i]
            .replace(/\<h[1-6]{1}\>/, "")
            .replace(/\<\/h[1-6]\>/, ""),
          tagName: matchDOM[i].match(/h[1-6]{1}/)[0],
        };
      }
      this.outlineList = matchDOM;
      console.log(matchDOM);
    },
    openFile(item) {
      // 打开目录
      console.log(item);
      if (item.type === "dir") {
        if (item.name === "../") {
          // 返回上一目录
          let pathTemp = this.filePath;
          for (let i = pathTemp.length - 1; i >= 0; i--) {
            // 从后往前遍历
            if (pathTemp.charAt(i) === "/") {
              if (i === this.filePath.length - 1) {
                pathTemp = pathTemp.substr(0, pathTemp.length - 1);
              } else {
                break;
              }
            } else {
              pathTemp = pathTemp.substr(0, pathTemp.length - 1);
            }
          }
          console.log("pathTemp", pathTemp);
          this.filePath = pathTemp;
        } else {
          console.log("打开目录", item);
          this.filePath += item.name + "/";
        }
        this.handleFile(this.filePath);
      } else if (item.type === "file") {
        openFile(this.filePath + item.name).then((res) => {
          console.log(res);
          this.$emit("openFile", res);
        });
        // console.log(data);
        // this.$emit("openFile", JSON.stringify(data, null, 4));
        // fs.readFile(this.filePath + item.name, "utf-8", (err, data) => {
        //   if (err) {
        //     console.log(err);
        //     return;
        //   }
        //   console.log(data);
        //   // this.$store.dispatch("setEditorHtml", data);
        //   this.$emit("openFile", JSON.stringify(data, null, 4));
        // });
      }
    },
    changeFileModel(type) {
      if (type == "outline") {
        this.handleOutline();
        this.fileModel = false;
      } else {
        this.handleFile(this.filePath);
        this.fileModel = true;
      }
    },
    fileListMousedown(e) {
      console.log(e);

      if (e.button == 2) {
        this.rightShow();
        this.rightMessage = {};
        this.rightMessage.target = "./" + e.target.title;

        // this.fileListRightMenuShow = true;
        // this.fileListRightMenuPosition.x = e.clientX + 10;
        // this.fileListRightMenuPosition.y = e.clientY - 20;
        // 点击了鼠标右键
      }
    },
    notifyRightClickMenu(e) {
      console.log(e);
      // console.log(
      //   e.target.parentNode.classList.find((val) => val === "fileItem")
      // );

      if (e.target.className.indexOf("fileItem") !== -1) {
        // 如果点击的不是文件列表
        this.fileListRightMenuShow = false;

        this.newFile = null;
        this.newFileName = "";
      }
    },
    createFile() {
      console.log(99554);
      ipcRenderer.send("createFile", {
        ...this.newFile,
        newFileName: this.newFileName,
      });
    },
  },

  watch: {
    fileModel(val) {
      setTimeout(() => {
        this.showFileModel = val;
      }, 10);
    },

    // filePath(val) {
    //   console.log(val, val.match(/\//g).length);
    //   if (val.match(/\//g).length > 1) {
    //     this.fileList.unshift({
    //       name: "../",
    //       icon: "fa-folder-open",
    //       type: "dir",
    //     });
    //     console.log("累死啦了", this.fileList);
    //   }
    // },
  },
};
</script>

<style lang="scss" scoped>
$fileBoxWidth: calc(100% - 60px);
$fileBoxBodyHeight: calc(100vh - 2rem - 25px - 2em);
.leftMenu {
  width: 400px;
  min-height: 100vh;
  overflow-x: hidden;
  background: #fff;
  transition: width 0.4s;
  display: flex;

  .menu {
    width: 60px;
    height: 100%;
    background: #454b50;
  }
  .fileBox {
    width: $fileBoxWidth;
    .fileBoxHeader {
      display: flex;
      justify-content: space-around;
      margin: 1em 0;

      div {
        font-size: 1.2rem;
        text-decoration: underline;
        cursor: pointer;
      }
    }
    .fileBoxBody {
      overflow-y: auto;
      overflow-x: hidden;
      height: $fileBoxBodyHeight;
      width: 100%;

      &::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }

      &::-webkit-scrollbar-track {
        background: #efefef;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-thumb {
        height: 5px;
        // background-color: #535353;
        background: #dbdcdc;
        border-radius: 5px;
      }
      &::-webkit-scrollbar-button {
        height: 0;
        background-color: #0e2531;
      }

      .outlineModel,
      .fileModel {
        transition: width 0.4s;
        overflow: hidden;
        padding: 0;
        transition: all 0.4s;
      }
      .outlineItem:hover,
      .fileItem:hover {
        // background: #9debdd;
        background: #454b50;
        color: #fff;
      }
      .fileItem {
        // height: 2rem;
        // display: flex;
        // align-items: center;
        vertical-align: middle;
        cursor: pointer;
        padding: 0.65em 1.5em;
        overflow-x: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .outlineItem-h1 {
        font-size: 2.1rem;
      }
      .outlineItem-h2 {
        font-size: 1.8rem;
      }
      .outlineItem-h3 {
        font-size: 1.55rem;
      }
      .outlineItem-h4 {
        font-size: 1.25rem;
      }
      .outlineItem-h5 {
        font-size: 1.1rem;
      }
      .outlineItem-h6 {
        font-size: 0.9rem;
      }
    }
  }
}
ul {
  list-style: none;
  padding: 0;
}
.menu {
  li {
    padding: 1.5em 0;
    display: flex;
    justify-content: center;
    cursor: pointer;

    i {
      // color: #979797;
      color: #afafaf;
      font-size: 2rem;
    }
  }
}

.RightClickMenu {
  width: 250px;
  position: fixed;
  box-shadow: 1px 2px 10px 1px #ccc;
}

.inputFileName {
  display: flex;
  align-items: center;
  .inputText {
    height: 1.2rem;
    width: 6rem;
    outline-color: #454b50;
  }
}

.showByFlex {
  display: flex;
}
.hideByFlex {
  display: none;
}
.fadeOut {
  animation: fadeOut 0.3s;
}
.fadeIn {
  animation: fadeIn 0.2s;
}
@keyframes fadeOut {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>