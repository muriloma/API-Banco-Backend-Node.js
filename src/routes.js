const { Router } = require('express');
const contas = require('./controllers/contas');
const transacoes = require('./controllers/transacoes');
const middleware = require('./middleware');
const rotas = Router();


//GET /contas?senha_banco=xxxx  #Lista as contas
rotas.get('/contas', middleware.validarSenhaBancoAdm, contas.listarContas);

//POST /contas    #Cria uma nova conta
rotas.post('/contas', middleware.validarNovaConta, contas.criarContaUsuario);

//PUT /contas/:numeroConta/usuario   #Atualiza dados de uma conta
rotas.put('/contas/:numeroConta/usuario',
    middleware.validarSenha,
    contas.atualizarCadastroUsuario);

//DELETE /contas/:numeroConta?senha_banco=xxxx   #Deleta uma conta
rotas.delete('/contas/:numeroConta',
    middleware.validarSenhaBancoAdm,
    contas.deletarConta);

// POST /transacoes/depositar   #Realiza um depósito na conta
rotas.post('/transacoes/depositar', transacoes.depositar);

// POST /transacoes/sacar  #Realiza um saque na cont
rotas.post('/transacoes/sacar', transacoes.sacar);

// POST /transacoes/transferir  #Realiza uma transferencia
rotas.post('/transacoes/transferir', transacoes.transferir);


module.exports = rotas;