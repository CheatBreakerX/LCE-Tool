const { Titlebar, TitlebarColor } = require("custom-electron-titlebar");

window.addEventListener('DOMContentLoaded', () => {
	new Titlebar({
		backgroundColor: TitlebarColor.fromHex("#000000"),
		menuTransparency: 0.2
	});
});
