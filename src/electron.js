const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const ExercicioDao = require('./db/exercicioDAO');

let exercicioDao = new ExercicioDao();

let mainWindow;

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
    exercicioDao.buscarTodos(exercicios => {
        console.log('atualizando');
	       mainWindow.webContents.send('exercicios:all', exercicios);
    });
});

ipcMain.on('modificacao:get', () => {
	mainWindow.webContents.send('modificacoes:all', modificacoes);
});

ipcMain.on('window:main', () => {
	mainWindow.webContents.send('window:listaExercicios');
});

ipcMain.on('window:inativos', () => {
	mainWindow.webContents.send('window:inativosExercicios');
});

ipcMain.on('exercicios:editar', (e, id) => {
    exercicioDao.buscar(id, exercicio => {
    	mainWindow.webContents.send('window:editar', exercicio);
    });
});

ipcMain.on('exercicios:info', (e, id) => {
    exercicioDao.buscar(id, exercicio => {
    	mainWindow.webContents.send('window:info', exercicio);
    });
});

ipcMain.on('exercicios:remover', (e, id) => {
    exercicioDao.buscar(id, exercicio => {
        let statusChanged = exercicio.status;
        statusChanged = statusChanged == true ? false : true;
        let exe = {descricao: exercicio.descricao, serie: exercicio.serie, peso: exercicio.peso, status: statusChanged, _id: id};

        exercicioDao.atualizar(exe, exercicioAtualizado => {
            console.log(exe);
            console.log(exercicioAtualizado);
            console.log('--------atual status------------');
            mainWindow.webContents.send('pode:atualizar');
        });
    });
});

ipcMain.on('modificacao:remover', (e, id) => {
    if(id > 0)
    {
        modificacoes.splice(id-1, 1);
        for(let i = 0; i < modificacoes.length; i++)
        {
            modificacoes[i].id = i+1;
        }
    }
});

ipcMain.on('salvar:exercicio', (e, id, desc, serie, peso, status, pesoCorrente) => {
    let idTask = id;
    const des = desc;
    const rep = serie;
    const kg = peso;
    const statusTask = status;
    const pesoAtual = id == null ? 0 : pesoCorrente;

    let exercicio;

    if(idTask == null)
    {
        exercicio = {descricao: des, serie: rep, peso: kg, status: statusTask};
        exercicioDao.inserir(exercicio, exercicioCadastrado => {
            console.log(exercicio);
            console.log(exercicioCadastrado);
            console.log('--------cadas------------');
            idTask = exercicio._id;
        });
    } else {
        exercicio = {descricao: des, serie: rep, peso: kg, status: statusTask, _id: idTask};
        exercicioDao.atualizar(exercicio, exercicioAtualizado => {
            console.log(exercicio);
            console.log(exercicioAtualizado);
            console.log('--------atual------------');
        });
    }


    if(pesoAtual != kg)
    {
        const index = modificacoes.length;
        modificacoes[index] = {id: index+1, exercicio_id: idTask, data: 'hoje', peso: kg};
    }

	mainWindow.webContents.send('window:listaExercicios');
});
