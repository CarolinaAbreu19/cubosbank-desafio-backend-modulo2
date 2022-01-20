const database = require('../bancodedados');
let idGeral = 1;

const listarContas = async (req, res) => {
    const { senha_banco } = req.query;
    const contas = database.contas;

    if(senha_banco.trim() === database.banco.senha) {
        return res.status(200).json({ contas: contas });
    } else {
        return res.status(401).json({ mensagem: "senha incorreta. Acesso não autorizado" })
    }
}

const criarConta = async (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    
    if(!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" })
    }

    const cpfExistente = database.contas.find(conta => conta.usuario.cpf === cpf);
    const emailExistente = database.contas.find(conta => conta.usuario.email === email);

    if(cpfExistente) {
        return res.status(400).json({ mensagem: "Este CPF já está associado a uma conta" });
    }

    if(emailExistente) {
        return res.status(400).json({ mensagem: "Este email já está associado a uma conta" });
    }

    const usuario = {
        nome: nome,
        cpf: cpf,
        data_nascimento: data_nascimento,
        telefone: telefone,
        email: email,
        senha: senha,
    }
    
    const conta = {
        id: idGeral.toString(),
        saldo: 0,
        usuario: usuario
    }

    database.contas.push(conta);
    idGeral++;
    return res.status(201).json(conta);

}

const atualizarUsuario = async (req, res) => {

}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario
}