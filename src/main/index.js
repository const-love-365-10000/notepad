import { app, BrowserWindow, Menu, dialog } from "electron";
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

let ipcMain = require("electron").ipcMain;

// 改变窗口大小
ipcMain.on("changWindowSize", (e, sizeArr) => {
	// console.log(mainWindow.getContentBounds());
	// console.log(sizeArr);
	let nowSize = mainWindow.getContentBounds();

	mainWindow.setContentSize(sizeArr[0], sizeArr[1]);
	mainWindow.center();
	// mainWindow.setPosition(nowSize.x + sizeArr[0] / 2, sizeArr[1] + 300, true); //设置窗口横坐标和纵坐标
	// mainWindow.setBounds(nowSize.x + sizeArr[0]);
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
