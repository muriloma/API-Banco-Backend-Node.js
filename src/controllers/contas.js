const fs = require('fs/promises')


const listarContas = async (req, res) => {
    const { senha_banco } = req.params;
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));

    if (senha_banco !== dadosBanco.banco.senha) {
        return res.status(400).json({ mensagem: "Senha incorreta" })
    }
    return res.status(200).json(dadosBanco.contas)
}

module.exports = { listarContas }