const { Router } = require('express');
const contas = require('./controllers/contas');
const transacoes = require('./controllers/transacoes');
const middleware = require('./middleware');
const rotas = Router();


//GET /contas?senha_banco=xxxx   #Lista as contas
rotas.get('/contas', middleware.validarSenhaBancoAdm, contas.listarContas);

//POST /contas   #Cria uma nova conta
rotas.post('/contas', middleware.validarNovaConta, contas.criarContaUsuario);

//PUT /contas/:numeroConta/usuario   #Atualiza dados do usuário de uma conta
rotas.put('/contas/:numeroConta/usuario',
    middleware.validarSenha,
    contas.atualizarCadastroUsuario);

//DELETE /contas/:numeroConta?senha_banco=xxxx   #Deleta uma conta
rotas.delete('/contas/:numeroConta',
    middleware.validarSenhaBancoAdm,
    contas.deletarConta);

// POST /transacoes/depositar   #Realiza um depósito na conta
rotas.post('/transacoes/depositar', transacoes.depositar);

// POST /transacoes/sacar   #Realiza um saque na conta
rotas.post('/transacoes/sacar', transacoes.sacar);

// POST /transacoes/transferir   #Realiza uma transferencia entre contas
rotas.post('/transacoes/transferir', transacoes.transferir);

// GET /contas/saldo/:numeroConta?senha=xxxxxx   #Informa o saldo de uma conta
rotas.get('/contas/saldo/:numeroConta', middleware.validarSenhaConsulta, contas.saldo);

// GET /contas/extrato/:numeroConta?senha=xxxxxx   #Traz o extrato de todas as transações de uma conta
rotas.get('/contas/extrato/:numeroConta', middleware.validarSenhaConsulta, contas.extrato)


module.exports = rotas;