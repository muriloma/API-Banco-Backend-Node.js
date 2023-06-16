const { Router } = require('express');
const contas = require('./controllers/contas');
const middleware = require('./middleware');
const rotas = Router();

//GET /contas?senha_banco=xxxx
rotas.get('/contas', middleware.validarSenhaBancoAdm, contas.listarContas);

//POST /contas
rotas.post('/contas', middleware.validarNovaConta, contas.criarContaUsuario);

module.exports = rotas;