const Datastore = require('nedb');

function ExercicioDao() {
    this.db = new Datastore({
        filename: './banco.db',
        autoload: true
    });

    this.inserir = (exercicio, callback) => {
        this.db.insert(exercicio, (err, exercicioCadastrado) => {
            callback(exercicioCadastrado);
        });
    };

    this.atualizar = (exercicio, callback) => {
        this.db.update({ _id: exercicio._id }, exercicio, {}, (err, exercicioAtualizado) => {
            callback(exercicioAtualizado);
        });
    };

    this.buscar = (_id, callback) => {
        this.db.find({ _id }, (err, exercicios) => {
            callback(exercicios[0]);
        });
    };

    this.buscarTodos = callback => {
        this.db.find({}).sort({ descricao: 1 }).exec((err, pessoas) => {
            callback(pessoas);
        });
    };

    this.remover = (exercicio, callback) => {
        this.db.remove({ _id: exercicio._id }, {}, (err, exercicio) => {
            callback(exercicio);
        });
    };
}

module.exports = ExercicioDao;
