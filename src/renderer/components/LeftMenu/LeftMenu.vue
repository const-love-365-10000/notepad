<template>
  <div class="leftMenu" :style="{ width: show ? '400px' : '0' }">
    <div class="menu"></div>
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
            v-for="i in fileList"
            :key="i.name"
            class="fileItem"
            @click="openFile(i)"
            :title="i.name"
          >
            <i class="fas" :class="i.icon" style="margin: 0 5px"></i>
            {{ i.name }}
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
    };
  },
  computed: {},
  created() {
    // this.fileList = fs.readdirSync("./", { withFileTypes: true });
    this.handleFile(this.filePath, "clickDir");

    this.$on("appMousedown", function (e) {
      console.log(885);
      if (e) {
        console.log(e);
      }
    });
  },
  methods: {
    handleFile(path, type) {
      if (type === "clickDir" && this.fileList && this.fileList.length > 0)
        return;

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
              icon: "fa-folder-open",
            };
          } else if (fileInfo.isFile()) {
            fileList[i] = { name: fileList[i], type: "file", icon: "fa-file" };
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
      let matchDOM = JSON.stringify(this.$store.state.Counter.editorHtml).match(
        /\<h[1-6]{1}\>.*?\<\/h[1-6]\>/g
      );
      // console.log(this.$store.state.Counter.editorHtml);
      console.log(
        JSON.stringify(this.$store.state.Counter.editorHtml).match(
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
        this.handleFile(this.filePath, "clickDir");
        this.fileModel = true;
      }
    },
    fileListMousedown(e) {
      console.log(e.button);

      if (e.button == 2) {
        this.fileListRightMenuShow = true;
        this.fileListRightMenuPosition.x = e.clientX + 10;
        this.fileListRightMenuPosition.y = e.clientY - 20;
        // 点击了鼠标右键
      }
    },
    notifyRightClickMenu(e) {
      console.log(e);

      if (e.target.className !== "fileItem") {
        // 如果点击的不是文件列表
        this.fileListRightMenuShow = false;
      }
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
$fileBoxWidth: calc(250px - 60px + 10px);
$fileBoxBodyHeight: calc(100vh - 2rem - 25px - 2em);
.leftMenu {
  width: 250px;
  min-height: 100vh;
  background: #fff;
  transition: width 0.5s;
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
      width: $fileBoxWidth;

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

      ul {
        list-style: none;
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

.RightClickMenu {
  width: 250px;
  position: fixed;
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