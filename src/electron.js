const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let tarefas = [
    {titulo: 'Tarefa 1', descricao: 'Desc 1'},
    {titulo: 'Tarefa 2', descricao: 'Desc 2'},
    {titulo: 'Tarefa 3', descricao: 'Desc 3'}
];

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		frame: false,
		show: false
	});
	mainWindow.loadURL(`http://localhost:3000`);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});
});

ipcMain.on('tarefas:get', () => {
	mainWindow.webContents.send('tarefas:all', tarefas);
});