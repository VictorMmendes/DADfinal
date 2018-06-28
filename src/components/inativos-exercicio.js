import React, { Component } from 'react';
const { ipcRenderer } = window.require('electron');

export default class InativosExercicios extends Component {
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

    renderList() {
        return (
            this.state.exercicios.map((exercicio) => {
                if(!exercicio.status)
                {
                    return (
                        <tr>
                            <td>
                                {exercicio.descricao}
                            </td>
                            <td>
                                {exercicio.serie}
                            </td>
                            <td>
                                {exercicio.peso}
                            </td>
                            <td>
                                <span class="icon icon-check events" onClick={() => this.remove(exercicio._id)}></span>
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
                    Exercícios Inativos
                </h3>
                <table className="table-striped main-table">
                <thead>
                    <tr>
                        <th>Exercício</th>
                        <th>Repetição</th>
                        <th>Peso Inicial</th>
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
