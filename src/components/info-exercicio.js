import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

export default class InfoExercicio extends Component {
    constructor(props)
    {
        super(props);

        this.state =
        {
            modificacoes: [],
            id: props.id,
            descricao: props.descricao,
            peso: props.peso,
            serie: props.serie,
            status: props.status,
            progress: 0
        };
    }

    componentDidMount() {
        this.requisitarModificacoes()
    }

    requisitarModificacoes() {
        ipcRenderer.send('modificacao:get');
        ipcRenderer.on('modificacoes:all', (e, modificacoesArray) => {
            this.setState({
                modificacoes: modificacoesArray
            });
        });
    }

    renderList() {
        return (
            this.state.modificacoes.map((modificacao) => {
                if(modificacao.exercicio_id === this.state.id)
                {
                    return (
                        <tr>
                            <td>
                                {modificacao.data}
                            </td>
                            <td>
                                {modificacao.peso}
                            </td>
                            <td>
                                <span class="icon icon-trash events" onClick={() => this.remove(modificacao.id)}></span>
                            </td>
                        </tr>
                    );
                } else {
                    return null;
                }
            })
        );
    }

    checkProgress() {
        let progress = 0;
        let modificacao = this.state.modificacoes;

        for(let i = modificacao.length-1; i > 0; i--)
        {
            progress += modificacao[i].peso - modificacao[i-1].peso;
        }

        return progress;
    }

    render() {
        return (
            <div className="info-window">
                <h3>
                    {this.state.descricao}
                    <i>{this.state.serie}</i>
                </h3>
                <table className="table-striped info-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Peso</th>
                        <th>Eventos</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderList()}
                    <tr>
                        <td><strong>Progresso</strong></td>
                        <td><strong>{this.checkProgress()}</strong></td>
                    </tr>
                </tbody>
                </table>
            </div>
        );
    }

    remove(id)
    {
        ipcRenderer.send('modificacao:remover', id);
        this.requisitarModificacoes();
    }
}
