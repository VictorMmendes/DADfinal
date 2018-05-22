import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ListaTarefas from './components/lista-tarefas';

class App extends Component {
  render() {
    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">Lista de Tarefas</h1>

          <div className="toolbar-actions">
            <button className="btn btn-default">
              <span className="icon icon-home"></span>
            </button>

            <div className="btn-group pull-right">
              <button id="minimizar" className="btn btn-default">
                <span className="icon icon-minus"></span>
              </button>
              <button id="maximizar" className="btn btn-default">
                <span className="icon icon-plus"></span>
              </button>
              <button id="fechar" className="btn btn-default">
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
                <span id="cadastrar" className="nav-group-item">
                  <span className="icon icon-plus-circled"></span>
                  Nova Tarefa
                </span>
              </nav>
            </div>
            <div className="pane" id="main-panel">
              <ListaTarefas />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
