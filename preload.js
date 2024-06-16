const { Titlebar, TitlebarColor } = require("custom-electron-titlebar");
const { contextBridge, ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
	new Titlebar({
		backgroundColor: TitlebarColor.fromHex("#000000"),
		menuTransparency: 0.2
	});
});


contextBridge.exposeInMainWorld("electron", {
	ipcRenderer: {
		send: (channel, data) => {
			ipcRenderer.send(channel, data);
		},
		on: (channel, func) => {
			ipcRenderer.on(channel, (event, ...args) => func(event, ...args));
		}
	}
});
