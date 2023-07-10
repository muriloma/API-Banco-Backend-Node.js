const fs = require('fs/promises');
const aux = require('../utils/auxfunc');
const { format } = require('date-fns');

// Você deverá, OBRIGATORIAMENTE:

// Verificar se o numero da conta e o valor do deposito foram informados no body OK
// Verificar se a conta bancária informada existe OK
// Não permitir depósitos com valores negativos ou zerados ok
// Somar o valor de depósito ao saldo da conta encontrada

const depositar = async (req, res) => {
    let { numeroConta, valor } = req.body;

    // O numero da conta vem como string e o valor como number
    if (!numeroConta || !valor) {
        return res.status(400).json({ mensagem: 'Por favor informar dados válidos' });
    };

    try {
        const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

        const conta = dadosBanco.contas.find((conta) => {
            return numeroConta === conta.numero
        });

        if (!conta) {
            return res.status(404).json({ mensagem: "Conta não localizada" });
        };

        if (Math.sign(valor) !== 1 || valor === 0) {
            return res.status(400).json({ mensagem: 'Valor não permitido para essa transação' });
        };

        conta.saldo += valor
        const data = format(new Date(), "dd-MM-yyyy' 'HH:mm:ss");

        const deposito = {
            data,
            numero_conta: String(numeroConta),
            valor
        };

        dadosBanco.depositos.push(deposito);
        await fs.writeFile('./src/database/banco.json', JSON.stringify(dadosBanco));

        return res.status(201).json({ mensagem: "Depósito realizado com sucesso!" });

    } catch (erro) {
        return res.status(500).json({ Erro: erro.message });
    };

};

module.exports = { depositar };