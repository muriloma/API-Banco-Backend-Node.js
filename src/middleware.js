const fs = require('fs/promises');


const validarSenhaBancoAdm = async (req, res, next) => {
    const { senha_banco } = req.query;
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

    if (senha_banco !== dadosBanco.banco.senha) {
        return res.status(400).json({ mensagem: "Senha incorreta" })
    };
    return next();
};

module.exports = { validarSenhaBancoAdm };