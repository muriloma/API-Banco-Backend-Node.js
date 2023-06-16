const fs = require('fs/promises');


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

    //await fs.writeFile('./src/enderecos.json', enderecoStringfy);

    await fs.writeFile('./src/database/banco.json', JSON.stringify(dadosBanco))

    return res.status(200).json({ mensagem: "Conta cadastrada com sucesso." })
}

module.exports = { listarContas, criarContaUsuario };