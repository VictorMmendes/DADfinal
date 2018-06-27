import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

export default class ListaExercicios extends Component {
    constructor(props)
    {
        super(props);

        this.state =
        {
            exercicios: []
        };
    }

    componentDidMount() {
        this.requisitarExerciciosDaAplicacaoElectron()
    }

    requisitarExerciciosDaAplicacaoElectron() {
        ipcRenderer.send('exercicios:get');
        ipcRenderer.on('exercicios:all', (e, exerciciosArray) => {
            this.setState({
                exercicios: exerciciosArray
            });
        });
    }

    edit(id)
    {
        const idTask = (id-1);
        ipcRenderer.send('exercicios:editar', idTask);
    }

    seeInfo(id)
    {
        const idTask = (id-1);
        ipcRenderer.send('exercicios:info', idTask);
    }

    changeStatus(id)
    {
        const idTask = (id-1);
        ipcRenderer.send('exercicios:changeStatus', idTask);
        this.requisitarExerciciosDaAplicacaoElectron();
    }

    renderList() {
        return (
            this.state.exercicios.map((exercicio) => {
                return (
                    <tr>
                        <td onClick={() => this.seeInfo(exercicio.id)}>
                            {exercicio.descricao}
                        </td>
                        <td>
                            {exercicio.serie}
                        </td>
                        <td>
                            {exercicio.peso}
                        </td>
                        <td>
                            <span class="icon icon-pencil events" onClick={() => this.edit(exercicio.id)}></span>
                            <span class="icon icon-cancel events" onClick={() => this.remove(exercicio.id)}></span>
                        </td>
                    </tr>
                );
            })
        );
    }

    remove(id)
    {
        ipcRenderer.send('exercicios:remover', id);
        this.requisitarExerciciosDaAplicacaoElectron();
    }

    render() {
        return (
            <div className="main-window">
                <table className="table-striped main-table">
                <thead>
                    <tr>
                        <th>Exercício</th>
                        <th>Repetição</th>
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
