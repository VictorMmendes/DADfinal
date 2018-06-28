const Datastore = require('nedb');

function ModificacaoDao() {
    this.db = new Datastore({
        filename: './modificacao.db',
        autoload: true
    });

    this.inserir = (modificacao, callback) => {
        this.db.insert(modificacao, (err, modificacaoCadastrado) => {
            callback(modificacaoCadastrado);
        });
    };

    this.buscarTodos = callback => {
        this.db.find({}).sort({ data: 1 }).exec((err, modificacoes) => {
            callback(modificacoes);
        });
    };

    this.remover = (_id, callback) => {
        this.db.find({ _id }, (err, modificacoes) => {
            this.db.remove({ _id: modificacoes[0]._id }, {}, (err, modificacao) => {
                callback(modificacao);
            });
        });
    };
}

module.exports = ModificacaoDao;
