const { app, BrowserWindow, Menu } = require("electron");
const customTitlebar = require("custom-electron-titlebar/main");
const path = require("path");
const serve = require("electron-serve");
const loadURL = serve({ directory: "public" });

customTitlebar.setupTitlebar();

let mainWindow;
const isMac = process.platform === "darwin";

function isDev() {
	return !app.isPackaged;
}

function createWindow() {
	app.name = "LCE Tool";
	Menu.setApplicationMenu(Menu.buildFromTemplate([
		// { role: "appMenu" }
		...(isMac
			? [
				{
					label: app.name,
					submenu: [
						{
							label: `About ${app.name}`,
							click: () => {
								mainWindow.webContents.send("open-about");
							}
						},
						{ type: "separator" },
						{ role: "services" },
						{ type: "separator" },
						{ role: "hide" },
						{ role: "hideOthers" },
						{ role: "unhide" },
						{ type: "separator" },
						{ role: "quit" }
					]
				}
			]
			: []
		),
		// { role: "fileMenu" }
		{
			label: "File",
			submenu: [
				{ role: isMac ? "close" : "quit" }
			]
		},
		// { role: "editMenu" }
		{
			label: "Edit",
			submenu: [
				{ role: "undo" },
				{ role: "redo" },
				{ type: "separator" },
				{ role: "cut" },
				{ role: "copy" },
				{ role: "paste" },
				...(isMac
					? [
						{ role: "pasteAndMatchStyle" },
						{ role: "delete" },
						{ role: "selectAll" },
						{ type: "separator" },
						{
							label: "Speech",
							submenu: [
								{ role: "startSpeaking" },
								{ role: "stopSpeaking" }
							]
						}
					]
					: [
						{ role: "delete" },
						{ type: "separator" },
						{ role: "selectAll" }
					]
				)
			]
		},
		// { role: "viewMenu" }
		{
			label: "View",
			submenu: [
				{ role: "reload" },
				{ role: "forceReload" },
				{ role: "toggleDevTools" },
				{ type: "separator" },
				{ role: "resetZoom" },
				{ role: "zoomIn" },
				{ role: "zoomOut" },
				{ type: "separator" },
				{ role: "togglefullscreen" }
			]
		},
		// { role: "windowMenu" }
		{
			label: "Window",
			submenu: [
				{ role: "minimize" },
				{ role: "zoom" },
				...(isMac
					? [
						{ type: "separator" },
						{ role: "front" },
						{ type: "separator" },
						{ role: "window" }
					]
					: [
						{ role: "close" }
					]
				)
			]
		},
		{
			role: "help",
			submenu: [
				{
					label: "MC Reference",
					submenu: [
						{
							label: "Chunk",
							click: async () => {
								const { shell } = require("electron");
								await shell.openExternal("https://minecraft.wiki/w/Chunk_format");
							}
						},
						{
							label: "Data",
							click: async () => {
								const { shell } = require("electron");
								await shell.openExternal("https://minecraft.wiki/w/Data_values");
							}
						},
						{
							label: "NBT",
							click: async () => {
								const { shell } = require("electron");
								await shell.openExternal("https://minecraft.wiki/w/NBT_format");
							}
						},
						{
							label: "Potion",
							click: async () => {
								const { shell } = require("electron");
								await shell.openExternal("https://minecraft-ids.grahamedgecombe.com/potion-calculator");
							}
						}
					]
				},
				{ type: "separator" },
				{
					label: "Source Code",
					click: async () => {
						const { shell } = require("electron");
						await shell.openExternal("https://github.com/CheatBreakerX/LCE-Tool");
					}
				},
				{
					label: "About",
					click: () => {
						mainWindow.webContents.send("open-about");
					}
				}
			]
		}
	]));

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 827,
		height: 675,
		titleBarStyle: "hidden",
		/* You can use *titleBarOverlay: true* to use the original Windows controls */
		titleBarOverlay: true,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: true
		},
		icon: path.join(__dirname, "public/favicon.png"),
		show: false
	});

	// This block of code is intended for development purpose only.
	// Delete this entire block of code when you are ready to package the application.
	if (isDev()) {
		mainWindow.loadURL("http://localhost:8080/");
	} else {
		loadURL(mainWindow);
	}
	
	// Uncomment the following line of code when app is ready to be packaged.
	// loadURL(mainWindow);

	// Open the DevTools and also disable Electron Security Warning.
	// process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
	// mainWindow.webContents.openDevTools();

	mainWindow.on("closed", function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	// Emitted when the window is ready to be shown
	// This helps in showing the window gracefully.
	mainWindow.once("ready-to-show", () => {
		mainWindow.show();
	});

	customTitlebar.attachTitlebarToWindow(mainWindow);
}

app.on("ready", createWindow);

process.on("SIGTERM", () => {
    app.quit();
});

app.on("window-all-closed", function () {
	if (!isMac) {
		app.quit();
	}
});

app.on("activate", function () {
	if (mainWindow === null) {
		createWindow();
	}
});
