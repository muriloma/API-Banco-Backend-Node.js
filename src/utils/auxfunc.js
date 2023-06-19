const fs = require('fs/promises');

const buscarCpf = async (cpf) => {
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
    return dadosBanco.contas.find((conta) => {
        return conta.usuario.cpf === cpf
    });
};

const buscarEmail = async (email) => {
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
    return dadosBanco.contas.find((conta) => {
        return conta.usuario.email === email
    });
};

const buscarConta = async (numeroConta) => {
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
    return dadosBanco.contas.find((conta) => {
        return numeroConta === conta.numero
    });
};


module.exports = { buscarCpf, buscarEmail, buscarConta };