// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron');
const customTitlebar = require("custom-electron-titlebar/main");
const path = require('path');
const serve = require('electron-serve');
const loadURL = serve({ directory: 'public' });

customTitlebar.setupTitlebar();

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function isDev() {
	return !app.isPackaged;
}

function createWindow() {    
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 827,
		height: 675,
		titleBarStyle: 'hidden',
		/* You can use *titleBarOverlay: true* to use the original Windows controls */
		titleBarOverlay: true,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
			contextIsolation: true,
			nodeIntegration: true
		},
		icon: path.join(__dirname, 'public/favicon.png'),
		show: false
	});

	// This block of code is intended for development purpose only.
	// Delete this entire block of code when you are ready to package the application.
	if (isDev()) {
		mainWindow.loadURL('http://localhost:8080/');
	} else {
		loadURL(mainWindow);
	}
	
	// Uncomment the following line of code when app is ready to be packaged.
	// loadURL(mainWindow);

	// Open the DevTools and also disable Electron Security Warning.
	// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true;
	// mainWindow.webContents.openDevTools();

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	// Emitted when the window is ready to be shown
	// This helps in showing the window gracefully.
	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

	customTitlebar.attachTitlebarToWindow(mainWindow);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});
