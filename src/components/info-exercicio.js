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
            status: props.status
        };
    }

    componentDidMount() {
        this.requisitarModificacoes()
    }

    requisitarModificacoes() {
        ipcRenderer.send('modificacoes:get');
        ipcRenderer.on('modificacoes:all', (e, modificacoesArray) => {
            this.setState({
                modificacoes: modificacoesArray
            });
        });
    }

    renderList() {
        return (
            this.state.modificacoes.map((modificacao) => {
                return (
                    <tr>
                        <td>
                            {modificacao.data}
                        </td>
                        <td>
                            {modificacao.peso}
                        </td>
                        <td>
                            <span class="icon icon-cancel events" onClick={() => this.remove(modificacao.id)}></span>
                        </td>
                    </tr>
                );
            })
        );
    }

    render() {
        return (
            <div className="info-window">
                <h3>{this.state.descricao}</h3>
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
                </tbody>
                </table>
            </div>
        );
    }
}
