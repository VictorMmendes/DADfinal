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
        ipcRenderer.send('exercicios:editar', id);
    }

    seeInfo(id)
    {
        ipcRenderer.send('exercicios:info', id);
    }

    renderList() {
        return (
            this.state.exercicios.map((exercicio) => {
                if(exercicio.status)
                {
                    return (
                        <tr>
                            <td onClick={() => this.seeInfo(exercicio._id)}>
                                {exercicio.descricao}
                            </td>
                            <td>
                                {exercicio.serie}
                            </td>
                            <td>
                                {exercicio.peso}
                                kg
                            </td>
                            <td>
                                <span class="icon icon-pencil events" onClick={() => this.edit(exercicio._id)}></span>
                                <span class="icon icon-cancel events" onClick={() => this.remove(exercicio._id)}></span>
                            </td>
                        </tr>
                    );
                } else {
                    return null;
                }
            })
        );
    }

    remove(id)
    {
        ipcRenderer.send('exercicios:remover', id);
        ipcRenderer.on('pode:atualizar', () => {
            this.requisitarExerciciosDaAplicacaoElectron();
        });
    }

    render() {
        return (
            <div className="main-window">
                <h3>
                    Lista de exercícios
                </h3>
                <table className="table-striped main-table">
                <thead>
                    <tr>
                        <th>Exercício</th>
                        <th>Repetição</th>
                        <th>Peso Atual</th>
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
