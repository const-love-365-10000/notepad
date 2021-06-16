import { app, BrowserWindow, Menu, dialog } from "electron";
import fsListMenu from "../renderer/util/fsListMenu.js";
let ipcMain = require("electron").ipcMain;
import store from "../renderer/store/index";
import "../renderer/store";

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
	global.__static = require("path")
		.join(__dirname, "/static")
		.replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
	process.env.NODE_ENV === "development"
		? `http://localhost:9080`
		: `file://${__dirname}/index.html`;

function createWindow() {
	/**
	 * Initial window options
	 */
	// 隐藏菜单栏
	Menu.setApplicationMenu(null);

	mainWindow = new BrowserWindow({
		height: 370,
		useContentSize: true,
		width: 400,
		frame: false,
	});

	mainWindow.loadURL(winURL);

	mainWindow.on("closed", () => {
		mainWindow = null;
	});
}

ipcMain.on("fileMenu", (e, res) => {
	console.log(res);
	if (res.type === "delete") {
		fsListMenu
			.deleteFile(res.event.target)
			.then(() => {
				console.log("文件删除成功");
				e.sender.send("updateFileList");
			})
			.catch((err) => {
				console.log("删除失败，原因：", err);
			});
	}
});

ipcMain.on("createFile", (e, res) => {
	console.log(res);
	if (res.type === "file") {
		fsListMenu
			.createFile(res.filePath + res.newFileName)
			.then(() => {
				console.log("文件新建成功");
				e.sender.send("updateFileList", { type: "createFileSuccess" });
			})
			.catch((err) => {
				console.log("失败，原因：", err);
			});
	} else if (res.type === "dir") {
		fsListMenu
			.createDir(res.filePath)
			.then(() => {
				console.log("文件新建成功");
				e.sender.send("updateFileList");
			})
			.catch((err) => {
				console.log("失败，原因：", err);
			});
	}
});

// 改变窗口大小
ipcMain.on("changWindowSize", (e, sizeArr) => {
	let nowSize = mainWindow.getContentBounds();

	mainWindow.setContentSize(sizeArr[0], sizeArr[1]);
	mainWindow.center();
});

//接收最小化命令
ipcMain.on("window-min", function () {
	mainWindow.minimize();
});
//接收最大化命令
ipcMain.on("window-max", function () {
	if (mainWindow.isMaximized()) {
		mainWindow.restore();
	} else {
		mainWindow.maximize();
	}
});
//接收关闭命令
ipcMain.on("window-close", function () {
	mainWindow.close();
	app.quit();

	// 不再使用系统对话框，使用自定义对话框
	// let res = dialog.showMessageBox(
	// 	{
	// 		type: "question",
	// 		title: "退出",
	// 		message: "要保存文件吗？",
	// 		buttons: ["保存", "不保存", "取消"],
	// 	},
	// 	(res) => {
	// 		if (res == 0) {
	// 		} else if (res == 1) {
	// 			mainWindow.close();
	// 		} else if (res == 2) {
	// 			console.log("取消关闭");
	// 		}
	// 	}
	// );

	// mainWindow.close();
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	if (mainWindow === null) {
		createWindow();
	}
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
