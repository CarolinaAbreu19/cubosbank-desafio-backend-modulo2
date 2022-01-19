const database = require('../bancodedados');

const listarContas = async (req, res) => {

    const contas = database.contas;
    return res.status(200).json(contas);

}

module.exports = {
    listarContas
}