const express = require('express');
const routes = express();

const contas = require('./controllers/contasController');
const transacoes = require('./controllers/transacoesController');

routes.get('/contas', contas.listarContas);
routes.post('/contas', contas.criarConta);
routes.put('/contas/:numeroConta/usuario', contas.atualizarUsuario);
routes.delete('/contas/:numeroConta', contas.excluirConta);

routes.post('/transacoes/depositar', transacoes.depositar);

module.exports = routes;