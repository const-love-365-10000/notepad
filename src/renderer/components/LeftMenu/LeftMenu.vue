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
          v-show="showFileModel"
          :style="{ width: fileModel ? '100%' : '0' }"
        >
          <li
            v-for="i in fileList"
            :key="i.name"
            class="fileItem"
            @click="openFile(i)"
          >
            <i class="fas" :class="i.icon" style="margin: 0 5px"></i>
            {{ i.name }}
          </li>
        </ul>
        <ul
          class="outlineModel"
          v-show="!showFileModel"
          :style="{ width: !fileModel ? '100%' : '0' }"
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
  </div>
</template>
<script>
const fs = require("fs");
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
  data() {
    return {
      fileList: [],
      showFileModel: true,
      outlineList: null,
      fileModel: true, // true is  file or false is outline
      filePath: "./",
    };
  },
  computed: {},
  created() {
    // this.fileList = fs.readdirSync("./", { withFileTypes: true });
    this.handleFile(this.filePath);
  },
  methods: {
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
        console.log("888");
        fs.readFile(this.filePath + item.name, "utf-8", (err, data) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log(data);
        });
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
  },

  watch: {
    fileModel(val) {
      setTimeout(() => {
        this.showFileModel = val;
      }, 510);
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
    width: calc(250px - 60px);
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
      ul {
        list-style: none;
      }
      .outlineModel,
      .fileModel {
        transition: width 0.4s;
        overflow: hidden;
        padding: 0;
      }
      .outlineItem:hover,
      .fileItem:hover {
        // background: #9debdd;
        background: #454b50;
        color: #fff;
      }
      .fileItem {
        height: 2rem;
        display: flex;
        align-items: center;
        cursor: pointer;

        padding: 0 1.5em;
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
</style>