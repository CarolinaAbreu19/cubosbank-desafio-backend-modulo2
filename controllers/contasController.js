const database = require('../bancodedados');

const listarContas = async (req, res) => {
    const { senha_banco } = req.query;
    const contas = database.contas;

    if(senha_banco.trim() === database.banco.senha) {
        return res.status(200).json({ contas: contas });
    } else {
        return res.status(401).json({ mensagem: "senha incorreta. Acesso não autorizado" })
    }
    

}

module.exports = {
    listarContas
}