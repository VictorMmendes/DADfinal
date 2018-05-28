import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

export default class NovaTarefa extends Component {
    constructor(props)
    {
        super(props);

        this.state =
        {
            painel: props.id == null ? "Nova Tarefa" : "Editar Tarefa",
            id: props.id,
            titulo: props.titulo,
            descricao: props.descricao,
            status: props.status
        };
    }

    inicio()
    {
        ipcRenderer.send('window:main');
    }

    adicionar()
    {
        const id = this.state.id;
        const status = this.state.status;
        const tit = document.getElementById('tit').value;
        const desc = document.getElementById('desc').value;

        ipcRenderer.send('salvar:tarefa', id, tit, desc, status);
    }

    render() {
        return (
            <div className="form-window">
                <form id="form-act">
                    <h1>{this.state.painel}</h1>
                    <div className="form-group">
                        <label>Título da Tarefa</label>
                        <input type="text" className="form-control" placeholder="Informe o título da tarefa" id="tit" defaultValue={this.state.titulo}/>
                    </div>
                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea className="form-control" rows="3" id="desc">{this.state.descricao}</textarea>
                    </div>
                    <div className="form-actions">
                        <span className="btn btn-default" onClick={() => this.inicio() }>Cancel</span>
                        <span className="btn btn-primary" onClick={() => this.adicionar() }>OK</span>
                    </div>
                </form>
            </div>
        );
    }
}
