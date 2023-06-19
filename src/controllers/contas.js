const fs = require('fs/promises');
const aux = require('../utils/auxfunc');
const validarEmail = require('email-validator');
const { validate } = require('gerador-validador-cpf');

const listarContas = async (req, res) => {
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
    return res.status(200).json(dadosBanco.contas);
};

const criarContaUsuario = async (req, res) => {
    const usuario = req.body;
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

    const novaConta = {
        numero: String(dadosBanco.id_contas++),
        saldo: 0,
        usuario
    };

    dadosBanco.contas.push(novaConta);
    await fs.writeFile('./src/database/banco.json', JSON.stringify(dadosBanco));

    return res.status(201).json(novaConta);
};

const atualizarCadastroUsuario = async (req, res) => {
    const novosDados = req.body;
    const { numeroConta } = req.params;
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

    const conta = await aux.buscarConta(numeroConta);
    for (let dado of Object.keys(novosDados)) {
        if (!Object.keys(conta.usuario).includes(dado)) {
            return res.status(404).json({ mensagem: 'Dado incorreto, por favor verifique o dado a ser atualizado' })
        }
    };

    if (novosDados.email) {
        const contaEmailBuscado = await aux.buscarEmail(novosDados.email);
        if (!validarEmail.validate(novosDados.email)) {
            return res.status(401).json({ mensagem: "Por favor informe um email válido" })
        };

        if (contaEmailBuscado && contaEmailBuscado.usuario.email !== conta.usuario.email) {
            return res.status(400).json({ mensagem: 'E-mail já utilizado, por favor informe outro email' })
        };
    };

    if (novosDados.cpf) {
        const contaCpfBuscado = await aux.buscarCpf(novosDados.cpf);
        if (!validate(novosDados.cpf)) {
            return res.status(401).json({ mensagem: "Por favor informe um CPF válido" })
        };

        if (contaCpfBuscado && contaCpfBuscado.usuario.cpf !== conta.usuario.cpf) {
            return res.status(400).json({ mensagem: 'CPF já utilizado, por favor informe outro CPF' })
        };
    };

    if (novosDados.nome && novosDados.nome.trim() === "") {
        return res.status(400).json({ mensagem: "Por favor preencha um nome válido" })
    };

    if (novosDados.telefone && novosDados.telefone.length() > 11 || novosDados.telefone.length() < 10) {
        return res.status(401).json({ mensagem: "Por favor informe um telefone com DDD válido" })
    };

    for (let dado of Object.keys(novosDados)) {
        dadosBanco.contas[numeroConta - 1].usuario[dado] = novosDados[dado];
    };

    await fs.writeFile('./src/database/banco.json', JSON.stringify(dadosBanco));
    return res.status(201).json({ mensagem: 'Conta atualizada com sucesso!' });
};
module.exports = {
    listarContas,
    criarContaUsuario,
    atualizarCadastroUsuario
};