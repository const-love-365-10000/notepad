# my-project2

## 技术栈

- Electron
- Electron-vue
- Electron-package

## 使用的库
watch
Watch 是一个监听文件夹改变的Node.JS模块  （不再使用）
https://github.com/mikeal/watch




## 编译

Electron-package使用方法：

`electron-packager <sourcedir> <appname> --platform=<platform> --arch=<arch> [optional flags...]`

例如：

`electron-packager . notepad  --win --out ./dist --arch=x64 --app-version=0.0.1 --electron-version=2.0.0`

可以用的
electron-packager . fukaiitapp --out fukaiitapp --arch=x64 --overwrite
electron-packager . notepad --out ../dist --arch=x64 --overwrite
