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
        this.db.find({}, (err, modificacoes) => {
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

    this.getLastId = callback => {
        this.db.find({}, (err, modificacoes) => {
            const sz = modificacoes.length-1;
            if(sz > -1)
            {
                callback(modificacoes[sz]._id + 1);
            } else {
                callback(1);
            }
        });
    };
}

module.exports = ModificacaoDao;
