const { Router } = require('express')
const {listarContas} = require('./controllers/contas')
const rotas = Router();

//GET /contas?senha_banco=xxxx
rotas.get('/contas', listarContas)

module.exports = rotas;