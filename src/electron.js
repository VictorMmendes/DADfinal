const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;
const ExercicioDao = require('./db/exercicioDAO');
const ModificacaoDao = require('./db/modificacaoDAO');

let exercicioDao = new ExercicioDao();
let modificacaoDao = new ModificacaoDao();

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
    modificacaoDao.buscarTodos(modificacoes => {
        console.log('atualizando modificacao');
	       mainWindow.webContents.send('modificacoes:all', modificacoes);
    });
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

ipcMain.on('exercicios:remover', (e, id, info) => {
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
    modificacaoDao.remover(id, modificacaoRemovida => {
        console.log(id);
        console.log(modificacaoRemovida);
        console.log('--------remov mod------------');
        mainWindow.webContents.send('agora:atualize');
    });
});

ipcMain.on('salvar:exercicio', (e, id, desc, serie, peso, status, pesoCorrente) => {
    let idTask = id;
    const des = desc;
    const rep = serie;
    const kg = peso;
    const statusTask = status;
    const pesoAtual = id == null ? 0 : pesoCorrente;

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = dd + '/' + mm + '/' + yyyy;

    let exercicio;

    if(idTask == null)
    {
        exercicio = {descricao: des, serie: rep, peso: kg, status: statusTask};
        exercicioDao.inserir(exercicio, exercicioCadastrado => {
            console.log(exercicio);
            console.log(exercicioCadastrado);
            console.log('--------cadas------------');
            idTask = exercicioCadastrado._id;

            modificacao = {exercicio_id: idTask, data: today, peso: kg};
            modificacaoDao.inserir(modificacao, modificacaoCadastrado => {
                console.log(modificacao);
                console.log(modificacaoCadastrado);
                console.log('--------cadas Mod------------');
            });
        });
    } else {
        exercicio = {descricao: des, serie: rep, peso: kg, status: statusTask, _id: idTask};
        exercicioDao.atualizar(exercicio, exercicioAtualizado => {
            console.log(exercicio);
            console.log(exercicioAtualizado);
            console.log('--------atual------------');
            idTask = exercicio._id;

            if(pesoAtual != exercicio.peso)
            {
                modificacao = {exercicio_id: idTask, data: today, peso: exercicio.peso};
                modificacaoDao.inserir(modificacao, modificacaoCadastrado => {
                    console.log(modificacao);
                    console.log(modificacaoCadastrado);
                    console.log('--------atual Mod------------');
                });
            }
        });
    }

	mainWindow.webContents.send('window:listaExercicios');
});
