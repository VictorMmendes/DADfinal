const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
let exercicios = [];
exercicios[0] = {id: 1, descricao: 'Leg Press 45º', serie: '4x10', peso: 70, status: false};
exercicios[1] = {id: 2, descricao: 'Rosca Direta', serie: '3x15', peso: 25, status: false};
exercicios[2] = {id: 3, descricao: 'Pulley Corda', serie: '3x10', peso: 35, status: true};

let modificacoes = [];

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

ipcMain.on('exercicios:get', () => {
	mainWindow.webContents.send('exercicios:all', exercicios);
});

ipcMain.on('modificacao:get', () => {
	mainWindow.webContents.send('modificacoes:all', modificacoes);
});

ipcMain.on('window:main', () => {
	mainWindow.webContents.send('window:listaExercicios');
});

ipcMain.on('exercicios:editar', (e, id) => {
    const exercicio = exercicios[id];
	mainWindow.webContents.send('window:editar', exercicio);
});

ipcMain.on('exercicios:info', (e, id) => {
    const exercicio = exercicios[id];
	mainWindow.webContents.send('window:editar', exercicio);
});

ipcMain.on('exercicios:remover', (e, id) => {
    if(id > 0)
    {
        exercicios.splice(id-1, 1);
        for(let i = 0; i < exercicios.length; i++)
        {
            exercicios[i].id = i+1;
        }
    }
});

ipcMain.on('exercicios:changeStatus', (e, id) => {
    const status = exercicios[id].status;
    exercicios[id].status = status == true ? false : true;
});


ipcMain.on('salvar:exercicio', (e, id, desc, serie, peso, status) => {
    const idTask = id == null ? exercicios.length+1 : id;
    const des = desc;
    const rep = serie;
    const kg = peso;
    const statusTask = status;
    exercicios[idTask-1] = {id: idTask, descricao: des, serie: rep, peso: kg, status: statusTask};

    const index = modificacoes.length;
    modificacoes[index] = {id: index+1, exercicio_id: idTask, data: 'hoje', peso: kg};

	mainWindow.webContents.send('window:listaExercicios');
});
