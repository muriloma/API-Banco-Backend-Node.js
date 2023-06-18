const fs = require('fs/promises');
const { validate } = require('gerador-validador-cpf')
const validarEmail = require('email-validator')
const aux = require('./utils/auxfunc')


const validarSenhaBancoAdm = async (req, res, next) => {
    const { senha_banco } = req.query;
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

    if (senha_banco !== dadosBanco.banco.senha) {
        return res.status(400).json({ mensagem: "Senha incorreta" })
    };
    return next();
};

const validarNovaConta = async (req, res, next) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

    if (!nome || nome.trim() === "") {
        return res.status(400).json({ mensagem: "Por favor preencha o nome" })
    };

    if (!cpf || !validate(cpf)) {
        return res.status(400).json({ mensagem: "Por favor informe um cpf válido" })
    }

    if (await aux.buscarCpf(cpf)) {
        return res.status(400).json({ mensagem: "Cpf já cadastrado" })
    };

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "Por favor informe a data de nascimento" })
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "Por favor informe o telefone" })
    }

    if (telefone.length() > 11 || telefone.length() < 10) {
        return res.status(400).json({ mensagem: "Por favor informe um telefone com DDD válido" })
    }

    if (!email || !validarEmail.validate(email)) {
        return res.status(400).json({ mensagem: "Por favor informe um email válido" })
    }

    if (await aux.buscarEmail(email)) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado" })
    };

    if (!senha) {
        return res.status(400).json({ mensagem: "Por favor informe a senha" })
    }
    
    if (isNaN(Number(senha))) {
        return res.status(400).json({ mensagem: "A senha só pode conter números" })
    }

    if (senha.length() < 8 || senha.length() > 24) {
        return res.status(400).json({ mensagem: "A senha deve conter de 8 a 24 dígitos" })
    }

    return next()
};

module.exports = { validarSenhaBancoAdm, validarNovaConta };