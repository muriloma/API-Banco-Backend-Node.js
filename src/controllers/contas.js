const funcAux = require('../utils/func-aux');
const fs = require('fs/promises')


const listarContas = async (req, res) => {
    const {senha_banco} = req.params;
    
    const banco = JSON.parse(await fs.readFile('./src/database/banco.json'));
    
    console.log(banco);
}

module.exports = {listarContas}