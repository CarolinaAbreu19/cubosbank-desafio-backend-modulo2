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
    if(cpfExistente) {
        return res.status(400).json({ mensagem: "Este CPF já está associado a uma conta" });
    }
    const emailExistente = database.contas.find(conta => conta.usuario.email === email);
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
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const { numeroConta } = req.params;

    if(!nome && !cpf && !data_nascimento && !telefone && !email && !senha) {
        return res.status(400).json({ mensagem: "É preciso passar pelo menos um campo no body da requisição" });
    }

    if(parseInt(numeroConta) % 1 !== 0) {
        return res.status(400).json({ mensagem: "Id inválido" });
    }

    const contaEncontrada = database.contas.find(conta => conta.id === numeroConta.toString().trim());
    if(!contaEncontrada) {
        return res.status(400).json({ mensagem: "Não existe conta associada ao id passado como parâmetro da requisição" });
    }

    const cpfExistente = database.contas.find(conta => conta.usuario.cpf === cpf);
    if(cpfExistente) {
        return res.status(400).json({ mensagem: "Este CPF já está associado a uma conta" });
    }
    const emailExistente = database.contas.find(conta => conta.usuario.email === email);
    if(emailExistente) {
        return res.status(400).json({ mensagem: "Este email já está associado a uma conta" });
    }

    if(nome) {
        contaEncontrada.usuario.nome = nome;
    }
    if(cpf) {
        contaEncontrada.usuario.cpf = cpf;
    }
    if(data_nascimento) {
        contaEncontrada.usuario.data_nascimento = data_nascimento;
    }
    if(telefone) {
        contaEncontrada.usuario.telefone = telefone;
    }
    if(email) {
        contaEncontrada.usuario.email = email;
    }
    if(senha) {
        contaEncontrada.usuario.senha = senha;
    }

    return res.status(200).json(contaEncontrada);
}

const excluirConta = async (req, res) => {
    const { numeroConta } = req.params;

    if(parseInt(numeroConta) % 1 !== 0) {
        return res.status(400).json({ mensagem: "Id inválido" });
    }

    const contaEncontrada = database.contas.find(conta => conta.id === numeroConta.toString().trim());
    if(!contaEncontrada) {
        return res.status(400).json({ mensagem: "Não existe conta associada ao id passado como parâmetro da requisição" });
    }

    if(contaEncontrada.saldo !== 0) {
        return res.status(400).json({ mensagem: "Não é possível excluir contas com saldo diferente de zero" });
    }

    database.contas.splice(database.contas.indexOf(contaEncontrada),1);
    return res.status(200).json({ mensagem: "Conta excluída com sucesso!" });
}

const saldo = async (req, res) => {
    const { numero_conta, senha } = req.query;

    if(!numero_conta || !senha) {
        return res.status(400).json({ mensagem: "Número da conta e senha devem ser passados no endereço da requisição como queries" });
    }

    if(numero_conta % 1 !== 0) {
        return res.status(400).json({ mensagem: "Número de conta inválido" });
    }

    const contaEncontrada = database.contas.find(conta => conta.id === numero_conta.toString().trim());
    if(!contaEncontrada) {
        return res.status(404).json({ mensagem: "Não existe conta associada ao id passado como parâmetro da requisição" });
    }

    if(contaEncontrada.usuario.senha !== senha.toString().trim()) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    }

    return res.status(200).json({ saldo: contaEncontrada.saldo });
}

const extrato = async (req, res) => {

}

module.exports = {
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    saldo,
    extrato
} 