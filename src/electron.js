const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let tarefas = [];
tarefas[0] = {id: 1, titulo: 'Tarefa 1', descricao: 'Desc 1', status: false};
tarefas[1] = {id: 2, titulo: 'Tarefa 2', descricao: 'Desc 2', status: false};
tarefas[2] = {id: 3, titulo: 'Tarefa 3', descricao: 'Desc 3', status: true};

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
	mainWindow = new BrowserWindow({
		width: 900,
		height: 600,
		frame: false,
		show: false,
        webPreferences: {
            webSecurity: false
        }
	});
	mainWindow.loadURL(`http://localhost:3000`);

	mainWindow.once('ready-to-show', () => {
		mainWindow.show();
	});

    mainWindow.on('closed', function() {
      mainWindow = null;
    });
});

ipcMain.on('window:minimize', () => {
    mainWindow.minimize();
});

ipcMain.on('window:maximize', () => {
    if (mainWindow.isMaximized())
      mainWindow.restore();
    else
      mainWindow.maximize();
});

ipcMain.on('window:close', () => {
    mainWindow.close();
});

ipcMain.on('tarefas:get', () => {
	mainWindow.webContents.send('tarefas:all', tarefas);
});

ipcMain.on('window:main', () => {
	mainWindow.webContents.send('window:listaTarefas');
});

ipcMain.on('tarefas:editar', (e, id) => {
    const tarefa = tarefas[id];
	mainWindow.webContents.send('window:editar', tarefa);
});

ipcMain.on('tarefas:changeStatus', (e, id) => {
    const status = tarefas[id].status;
    tarefas[id].status = status == true ? false : true;
});


ipcMain.on('salvar:tarefa', (e, id, tit, desc, status) => {
    const idTask = id == null ? tarefas.length+1 : id;
    const titu = tit;
    const descri = desc;
    const statusTask = status;
    tarefas[idTask-1] = {id: idTask, titulo: titu, descricao: descri, status: statusTask};
	mainWindow.webContents.send('window:listaTarefas');
});
