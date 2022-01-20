const database = require('../bancodedados');

async function verificarCpfeEmail(res, cpf, email) {
    const cpfExistente = database.contas.find(conta => conta.usuario.cpf === cpf);
    const emailExistente = database.contas.find(conta => conta.usuario.email === email);

    if(cpfExistente) {
        return res.status(400).json({ mensagem: "Este CPF já está associado a uma conta" });
    }

    if(emailExistente) {
        return res.status(400).json({ mensagem: "Este email já está associado a uma conta" });
    }
}

module.exports = {
    verificarCpfeEmail
}