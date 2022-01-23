const database = require('../bancodedados');
const { format } = require('date-fns');

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
    const transacaoEfetuada = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: numero_conta.toString(),
        valor: valor
    }
    database.depositos.push(transacaoEfetuada);
    return res.status(200).json(transacaoEfetuada);
}

const transferir = async (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    if(!numero_conta_origem || !numero_conta_destino || !valor) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }

    if(numero_conta_origem % 1 !== 0 || numero_conta_destino % 1 !== 0) {
        return res.status(400).json({ mensagem: "Número de conta inválido" });
    }

    if(valor % 1 !== 0) {
        return res.status(400).json({ mensagem: "Valor para depósito inválido" });
    }
    
    if(numero_conta_origem.toString() === numero_conta_destino.toString()) {
        return res.status(400).json({ mensagem: "Não é possível efetuar uma transferência para a própria conta" });
    }

    const contaOrigemEncontrada = database.contas.find(conta => conta.id === numero_conta_origem.toString());
    const contaDestinoEncontrada = database.contas.find(conta => conta.id === numero_conta_destino.toString());

    if(!contaOrigemEncontrada) {
        return res.status(404).json({ mensagem: "Não foi possível encontrar a conta de origem associada a este id" });
    }

    if(!contaDestinoEncontrada) {
        return res.status(404).json({ mensagem: "Não foi possível encontrar a conta de destino associada a este id" });
    }

    if(valor > contaOrigemEncontrada.saldo) {
        return res.status(400).json({ mensagem: "Saldo insuficiente para efetuar a transação" });
    }

    contaOrigemEncontrada.saldo -= valor;
    contaDestinoEncontrada.saldo += valor;
    const transacaoEfetuada = {
        data: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem: numero_conta_origem.toString(),
        numero_conta_destino: numero_conta_destino.toString(),
        valor: valor
    }
    database.transferencias.push(transacaoEfetuada);
    return res.status(200).json(transacaoEfetuada);
}

const sacar = async (req, res) => {
    const { numero_conta, valor, senha } = req.body;

    if(!numero_conta || !valor || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }

    if(numero_conta % 1 !== 0) {
        return res.status(400).json({ mensagem: "Número de conta inválido" });
    }

    const contaEncontrada = database.contas.find(conta => conta.id === numero_conta.toString().trim());
    if(!contaEncontrada) {
        return res.status(404).json({ mensagem: "Não foi possível encontrar a conta associada a este id" });
    }

    if(contaEncontrada.usuario.senha !== senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    if(contaEncontrada.saldo < valor) {
        return res.status(400).json({ mensagem: "Saldo insuficiente" });
    }

    contaEncontrada.saldo -= valor;
    return res.status(200).json({ mensagem: "Saque realizado com sucesso!" });
}

module.exports = {
    depositar,
    transferir,
    sacar
}