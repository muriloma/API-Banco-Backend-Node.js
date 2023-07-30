const fs = require('fs/promises');
const aux = require('../utils/auxfunc');
const { format } = require('date-fns');


const depositar = async (req, res) => {
    let { numeroConta, valor } = req.body;
    numeroConta = String(numeroConta);

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
            numero_conta: numeroConta,
            valor
        };

        dadosBanco.depositos.push(deposito);
        await fs.writeFile('./src/database/banco.json', JSON.stringify(dadosBanco));

        return res.status(201).json({ mensagem: "Depósito realizado com sucesso!" });

    } catch (erro) {
        return res.status(500).json({ Erro: erro.message });
    };

};


const sacar = async (req, res) => {
    let { valor, numeroConta, senha } = req.body;

    if (!senha) {
        return res.status(400).json({ mensagem: 'Por favor informar uma senha válida' });
    };

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

        if (senha !== conta.usuario.senha) {
            return res.status(403).json({ mensagem: "Senha incorreta" });
        };

        if (Math.sign(valor) !== 1 || valor === 0) {
            return res.status(400).json({ mensagem: 'Valor não permitido para essa transação' });
        };

        if (conta.saldo < valor) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente' });
        };

        conta.saldo -= valor;
        const data = format(new Date(), "dd-MM-yyyy' 'HH:mm:ss");

        const saque = {
            data,
            numero_conta: String(numeroConta),
            valor
        };

        dadosBanco.saques.push(saque);
        await fs.writeFile('./src/database/banco.json', JSON.stringify(dadosBanco));

        return res.status(201).json({ mensagem: "Saque realizado com sucesso!" });

    } catch (erro) {
        return res.status(500).json({ Erro: erro.message });
    };
};

// Você deverá, OBRIGATORIAMENTE:

// Verificar se o número da conta de origem, de destino, senha da conta de origem ok
// e valor da transferência foram informados no body ok 
// Verificar se a conta bancária de origem informada existe ok
// Verificar se a conta bancária de destino informada existe ok
// Verificar se a senha informada é uma senha válida para a conta de origem informada ok
// Verificar se há saldo disponível na conta de origem para a transferência ok
// Subtrair o valor da transfência do saldo na conta de origem ok
// Somar o valor da transferência no saldo da conta de destino ok

const transferir = async (req, res) => {
    const { numeroContaOrigem, numeroContaDestino, senha, valor } = req.body;

    if (!senha) {
        return res.status(400).json({ mensagem: 'Por favor informar uma senha válida' });
    };

    if (!numeroContaOrigem || !numeroContaDestino || !valor) {
        return res.status(400).json({ mensagem: 'Por favor informar dados válidos' });
    };

    try {
        const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

        const contaOrigem = dadosBanco.contas.find((conta) => {
            return numeroContaOrigem === conta.numero
        });
        const contaDestino = dadosBanco.contas.find((conta) => {
            return numeroContaDestino === conta.numero
        });

        if (!contaOrigem) {
            return res.status(404).json({ mensagem: 'Conta de origem não localizada' });
        };

        if (!contaDestino) {
            return res.status(404).json({ mensagem: 'Conta de destino não localizada' });
        };

        if (senha !== contaOrigem.usuario.senha) {
            return res.status(403).json({ mensagem: "Senha incorreta" });
        };

        if (Math.sign(valor) !== 1 || valor === 0) {
            return res.status(400).json({ mensagem: 'Valor não permitido para essa transação' });
        };

        if (contaOrigem.saldo < valor) {
            return res.status(400).json({ mensagem: 'Saldo insuficiente' });
        };

        contaOrigem.saldo -= valor;
        contaDestino.saldo += valor;

        const data = format(new Date(), "dd-MM-yyyy' 'HH:mm:ss");
        const transferencia = {
            data,
            numero_conta_origem: String(numeroContaOrigem),
            numero_conta_destino: String(numeroContaDestino),
            valor
        };
        dadosBanco.transferencias.push(transferencia);
        await fs.writeFile('./src/database/banco.json', JSON.stringify(dadosBanco));

        return res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });

    } catch (erro) {
        return res.status(500).json({ Erro: erro.message });
    }
}

module.exports = { depositar, sacar, transferir };