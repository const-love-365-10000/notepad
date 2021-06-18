# my-project2

## 技术栈

- Electron
- Electron-vue
- Electron-package

## 使用的库
marked
    markdown语法转html
turndown
    html转markdown
dompurify
    dom清理
Remix icon图标库
开源






## 编译

Electron-package使用方法：

`electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]`

例如：

`electron-packager . notepad  --win --out ./dist --arch=x64 --app-version=0.0.1 --electron-version=2.0.0`

可以用的
electron-packager . fukaiitapp --out fukaiitapp --arch=x64 --overwrite
electron-packager . notepad --out ../dist --arch=x64 --overwrite

