import React, { Component } from 'react';
import './App.css';
import ListaExercicios from './components/lista-exercicios';
import NovoExercicio from './components/novo-exercicio';
import InfoExercicio from './components/info-exercicio';
import InativosExercicios from './components/inativos-exercicio';
const { ipcRenderer } = window.require('electron');

class App extends Component
{
    constructor()
    {
        super();
        this.state =
        {
            panel: <ListaExercicios />
        };

        ipcRenderer.on('window:listaExercicios', () => {
            this.loadPanel("main");
        });

        ipcRenderer.on('window:inativosExercicios', () => {
            this.loadPanel("inativos");
        });

        ipcRenderer.on('window:editar', (e, exercicio) => {
            this.loadPanelWithData("newTask", exercicio._id, exercicio.descricao, exercicio.serie, exercicio.peso, exercicio.status);
        });

        ipcRenderer.on('window:info', (e, exercicio) => {
            this.loadPanelWithData("infoTask", exercicio._id, exercicio.descricao, exercicio.serie, exercicio.peso, exercicio.status);
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

    loadPanel(info)
    {
        this.setState({
            panel: info === "main" ? <ListaExercicios /> : <InativosExercicios />
        });
    }

    loadPanelWithData(info, id, descricao, serie, peso, status)
    {
        this.setState({
            panel: info === "newTask" ? <NovoExercicio id={id} descricao={descricao} serie={serie} peso={peso} status={status}/> : <InfoExercicio id={id} descricao={descricao} serie={serie} peso={peso} status={status}/>
        });
    }

    render()
    {
        return(
            <div className="window">
                <header className="toolbar toolbar-header">
                    <h1 className="title">Gym Progress</h1>

                    <div className="toolbar-actions">
                        <button className="btn btn-default" onClick={() => this.loadPanel("main")}>
                            <span className="icon icon-home"></span>
                        </button>
                        <button className="btn btn-default" onClick={() => this.loadPanel("inativos")}>
                            <span className="icon icon-attach"></span>
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
                                <h5 className="nav-group-title">Eventos</h5>
                                <span id="cadastrar" className="nav-group-item" onClick={() => this.loadPanelWithData("newTask")}>
                                    <span className="icon icon-plus-circled"></span>
                                    Novo Exercício
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
