const fs = require('fs/promises');


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

    if (!cpf) {
        return res.status(400).json({ mensagem: "Por favor informe o cpf" })
    }

    const cpfEmUso = dadosBanco.contas.find((conta) => {
        return conta.usuario.cpf === cpf
    });

    if (cpfEmUso) {
        return res.status(400).json({ mensagem: "Cpf já cadastrado" })
    };

    if (!data_nascimento) {
        return res.status(400).json({ mensagem: "Por favor informe a data de nascimento" })
    }

    if (!telefone) {
        return res.status(400).json({ mensagem: "Por favor informe o telefone" })
    }

    if (!email) {
        return res.status(400).json({ mensagem: "Por favor informe o email" })
    }

    const emailEmUso = dadosBanco.contas.find((conta) => {
        return conta.usuario.email === email
    });

    if (emailEmUso) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado" })
    };

    if (!senha) {
        return res.status(400).json({ mensagem: "Por favor informe a senha" })
    }

    return next()
};

module.exports = { validarSenhaBancoAdm, validarNovaConta };