const database = require('../bancodedados');

const depositar = async (req, res) => {
    const { numero_conta, valor } = req.body;

    if(!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "Os campos numero_conta e valor são obrigatórios" });
    }

    if(numero_conta % 1 !== 0) {
        return res.status(400).json({ mensagem: "Número de conta inválido" });
    }

    if(valor % 1 !== 0) {
        return res.status(400).json({ mensagem: "Valor para depósito inválido" });
    }

    const contaEncontrada = database.contas.find(conta => conta.id === numero_conta.toString());
    if(!contaEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta associada ao id passado como corpo da requisição" });
    }

    contaEncontrada.saldo += valor;
    return res.status(200).json({ mensagem: "Depósito efetuado com sucesso!" });
}

module.exports = {
    depositar,
}