const fs = require('fs/promises');


const listarContas = async (req, res) => {
    const dadosBanco = JSON.parse(await fs.readFile('./src/database/banco.json'));
    return res.status(200).json(dadosBanco.contas);
};

module.exports = { listarContas };