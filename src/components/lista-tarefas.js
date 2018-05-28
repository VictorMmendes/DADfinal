import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

export default class ListaTarefa extends Component {
    constructor(props)
    {
        super(props);

        this.state =
        {
            tarefas: []
        };
    }

    componentDidMount() {
        this.requisitarTarefasDaAplicacaoElectron()
    }

    requisitarTarefasDaAplicacaoElectron() {
        ipcRenderer.send('tarefas:get');
        ipcRenderer.on('tarefas:all', (e, tarefasArray) => {
            this.setState({
                tarefas: tarefasArray
            });
        });
    }

    edit(id)
    {
        const idTask = (id-1);
        ipcRenderer.send('tarefas:editar', idTask);
    }

    changeStatus(id)
    {
        const idTask = (id-1);
        ipcRenderer.send('tarefas:changeStatus', idTask);
        this.requisitarTarefasDaAplicacaoElectron();
    }

    renderList() {
        return (
            this.state.tarefas.map((tarefa) => {
                return (
                    <tr>
                        <td>
                            <input type="checkbox" onClick={() => this.changeStatus(tarefa.id)} checked={tarefa.status}/>
                        </td>
                        <td id={ 'status_' + tarefa.id } onClick={() => this.edit(tarefa.id)}>
                            {this.checkStatus(tarefa.status, tarefa.titulo)}
                        </td>
                    </tr>
                );
            })
        );
    }

    checkStatus(status, titulo)
    {
        if(status)
        {
            return <strike>{titulo}</strike>
        } else {
            return titulo
        }
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
