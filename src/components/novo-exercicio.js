import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

export default class NovoExercicio extends Component {
    constructor(props)
    {
        super(props);

        this.state =
        {
            painel: props.id == null ? "Novo Exercício" : "Editar Exercício",
            id: props.id,
            descricao: props.descricao,
            peso: props.peso,
            serie: props.serie,
            serieIndex: null,
            qtdeIndex: null,
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
        const desc = document.getElementById('desc').value;
        const serie = document.getElementById('serie').value + "x" + document.getElementById('qtde').value;
        const peso = document.getElementById('peso').value;

        ipcRenderer.send('salvar:exercicio', id, desc, serie, peso, status);
    }

    dividir()
    {
        if(this.state.serie != null)
        {
            var str = this.state.serie;
            str = str.split('x');
            this.state.serieIndex = str[0];
            this.state.qtdeIndex = str[1];
        }
    }

    render() {
        return (
            <div className="form-window">
                <form id="form-act">
                    {this.dividir()}
                    <h1>{this.state.painel}</h1>
                    <div className="form-group">
                        <label>Descrição</label>
                        <input type="text" className="form-control" placeholder="Informe a descrição do exercício" id="desc" defaultValue={this.state.descricao}/>
                    </div>
                    <div className="form-group">
                        <h6>Repetição</h6>
                        <input type="number" max="4" min="0" className="form-control" placeholder="3" id="serie" defaultValue={this.state.serieIndex}/>
                        x
                        <input type="number" max="30" min="0" className="form-control" placeholder="15" id="qtde" defaultValue={this.state.qtdeIndex}/>
                    </div>
                    <div className="form-group">
                        <h6>Peso</h6>
                        <input type="number" min="0" className="form-control" placeholder="30" id="peso" defaultValue={this.state.peso}/>
                        kg
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
