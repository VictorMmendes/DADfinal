import React, { Component } from 'react';
import './App.css';
import ListaTarefas from './components/lista-tarefas';
import NovaTarefa from './components/nova-tarefa';
const { ipcRenderer } = window.require('electron');

class App extends Component
{
    constructor()
    {
        super();
        this.state =
        {
            panel: <ListaTarefas />
        };

        ipcRenderer.on('window:listaTarefas', () => {
            this.loadPanel("main");
        });

        ipcRenderer.on('window:editar', (e, tarefa) => {
            this.loadPanel("newTask", tarefa.id, tarefa.titulo, tarefa.descricao, tarefa.status);
        });
    }

    minimize()
    {
        ipcRenderer.send('window:minimize');
    }

    maximize()
    {
        ipcRenderer.send('window:maximize');
    }

    close()
    {
        ipcRenderer.send('window:close');
    }

    loadPanel(info, id, titulo, descricao, status)
    {
        this.setState({
            panel: info === "main" ? <ListaTarefas /> : <NovaTarefa id={id} titulo={titulo} descricao={descricao} status={status}/>
        });
    }

    render()
    {
        return(
            <div className="window">
                <header className="toolbar toolbar-header">
                    <h1 className="title">Lista de Tarefas</h1>

                    <div className="toolbar-actions">
                        <button className="btn btn-default" onClick={() => this.loadPanel("main")}>
                            <span className="icon icon-home"></span>
                        </button>

                        <div className="btn-group pull-right">
                            <button id="minimizar" className="btn btn-default" onClick={() => this.minimize()}>
                                <span className="icon icon-minus"></span>
                            </button>
                            <button id="maximizar" className="btn btn-default" onClick={() => this.maximize()}>
                                <span className="icon icon-plus"></span>
                            </button>
                            <button id="fechar" className="btn btn-default" onClick={() => this.close()}>
                                <span className="icon icon-cancel"></span>
                            </button>
                        </div>
                    </div>
                </header>

                <div className="window-content">
                    <div className="pane-group">
                        <div className="pane pane-sm sidebar">
                            <nav className="nav-group">
                                <h5 className="nav-group-title">Tarefas</h5>
                                <span id="cadastrar" className="nav-group-item" onClick={() => this.loadPanel("newTask")}>
                                    <span className="icon icon-plus-circled"></span>
                                    Nova Tarefa
                                </span>
                            </nav>
                        </div>
                        <div className="pane" id="main-panel">
                            { this.state.panel }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
