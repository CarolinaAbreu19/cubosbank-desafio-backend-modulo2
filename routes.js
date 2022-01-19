const express = require('express');
const routes = express();

const contas = require('./controllers/contasController');
const transacoes = require('./controllers/transacoesController');

routes.get('/contas/', contas.listarContas);

module.exports = routes;