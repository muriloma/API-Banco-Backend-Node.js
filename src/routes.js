const { Router } = require('express');
const { listarContas } = require('./controllers/contas');
const { validarSenhaBancoAdm } = require('./middleware');
const rotas = Router();

//GET /contas?senha_banco=xxxx
rotas.get('/contas', validarSenhaBancoAdm, listarContas);

module.exports = rotas;