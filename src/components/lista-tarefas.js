import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

export default class ListaTarefa extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tarefas: []
        };
    }

    componentDidMount() {
        this.requisitarTarefasDaAplicacaoElectron()
    }

    requisitarTarefasDaAplicacaoElectron() {
        ipcRenderer.send('tarefas:get');
        ipcRenderer.on('tarefas:all', (e, tarefas) => {
            this.setState({tarefas});
        });
    }

    renderList() {
        return (
            this.state.tarefas.map((tarefa) => {
                return (
                    <tr>
                        <td>
                            <input type="checkbox" />
                        </td>
                        <td>
                            {tarefa.titulo}
                        </td>
                    </tr>
                );
            })
        );
    }

    render() {
        return (
            <div className="main-window">
                <table className="table-striped main-table">
                <thead>
                    <tr>
                    <th></th>
                    <th>Tarefa</th>
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