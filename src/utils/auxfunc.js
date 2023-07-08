const fs = require('fs/promises');

const buscarCpf = async (cpf) => {
    try {
        const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
        return dadosBanco.contas.find((conta) => {
            return conta.usuario.cpf === cpf
        });
    } catch (erro) {
        return res.status(500).json({ Erro: erro.message });
    }
};

const buscarEmail = async (email) => {
    try {
        const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
        return dadosBanco.contas.find((conta) => {
            return conta.usuario.email === email
        });

    } catch (erro) {
        return res.status(500).json({ Erro: erro.message });
    }
};

const buscarConta = async (numeroConta) => {
    try {
        const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
        return dadosBanco.contas.find((conta) => {
            return numeroConta === conta.numero
        });

    } catch (erro) {
        return res.status(500).json({ Erro: erro.message });
    }
};


module.exports = { buscarCpf, buscarEmail, buscarConta };