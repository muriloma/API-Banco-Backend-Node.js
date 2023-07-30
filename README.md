# API Banco digital

Projeto de API RESTful que roda em servidor local e simula as funcionalidades de um banco.

-   **FUNCIONALIDADES**:
    -   Criar conta bancária
    -   Atualizar os dados do usuário da conta bancária
    -   Depósitar em uma conta bancária
    -   Sacar de uma conta bancária
    -   Transferir valores entre contas bancárias
    -   Consultar saldo da conta bancária
    -   Emitir extrato bancário
    -   Excluir uma conta bancária



## Persistências dos dados

Os dados serão persistidos em arquivo JSON, existente dentro da pasta `database`, sendo escritos no arquivo através da biblioteca **`fs/promises`**. Todas as transações e contas bancárias deverão ser inseridas dentro deste objeto, seguindo a estrutura que já existe.

### Estrutura do objeto no arquivo `banco.json`

```javascript
{
    banco: {
        nome: "Bank",
        numero: "123",
        agencia: "0001",
        senha: "123Bank",
    },
    id_contas: // número em série para criação de novas contas bancárias,
    contas: [
        // array de contas bancárias
    ],
    saques: [
        // array de saques
    ],
    depositos: [
        // array de depósitos
    ],
    transferencias: [
        // array de transferências
    ],
}
```

## Status Code

Abaixo, listei os possíveis `status code` esperados como resposta da API.

```javascript
// 200 = requisição bem sucedida
// 201 = requisição bem sucedida e algo foi criado
// 400 = o servidor não entendeu a requisição pois está com uma sintaxe/formato inválido
// 404 = o servidor não pode encontrar o recurso solicitado
// 500 = erro interno do servidor
```

## Endpoints

### Listar contas bancárias

#### `GET` `/contas?senha_banco=123Bank`

Esse endpoint lista todas as contas bancárias existentes. Deve ser passada a senha do banco como query params na URL da requisição.

-   **VALIDAÇÕES**:

    -   Verifica se a senha do banco foi informada (passado como query params na url)
    -   Valida se a senha do banco está correta

-   Entrada (query params)

    -   Senha do banco

-   Saída
    -   listagem de todas as contas bancárias existentes

#### Exemplo de retorno

```javascript
// 2 contas encontradas
[
    {
        numero: "1",
        saldo: 0,
        usuario: {
            nome: 'Teste',
            cpf: '12443929108',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'teste@bank.com',
            senha: '123456'
        }
    },
    {
        numero: "2",
        saldo: 1000,
        usuario: {
            nome: 'Cicrano',
            cpf: '61107890039',
            data_nascimento: '2021-03-15',
            telefone: '71999998888',
            email: 'email@bank.com',
            senha: '123456'
        }
    }
]

// nenhuma conta encontrada
[]
```

### Criar conta bancária

#### `POST` `/contas`

Esse endpoint cria uma conta bancária, onde será gerado um número único para identificação da conta (número da conta). Os dados da conta deverão ser passados através do body da requisição no formato JSON.

-   **DADOS**:

    -   O e-mail e CPF devem ser campos únicos.
    -   A data de nascimento deve ser informada no formato yyyy-mm-dd.
    -   O telefone com DDD deve conter 10 ou 11 dígitos.
    -   A senha deve ser composta por apenas 6 números.

-   **VALIDAÇÕES**:

    -   Utiliza a biblioteca **gerador-validador-cpf** para validar o CPF passado.
    -   Utiliza a biblioteca **email-validator** para validar o e-mail passado.
    -   Verifica se o CPF passado já está em uso.
    -   Verifica se o e-mail passado já está em uso.
    -   Verifica se todos os campos foram informados (todos são obrigatórios).
    -   Verifica a quantidade de dígitos passados no número de telefone.
    -   O saldo inicial da conta é definido como 0.

-   Entradas

    -   Nome
    -   Cpf
    -   Data Nascimento
    -   Telefone
    -   Email
    -   Senha

-   Saída

    -   Dados usuário
    -   Número da conta
    -   Saldo

#### Entrada

```json
{
	"nome": "Atol",
 	"cpf": "27633626488",
	"data_nascimento": "2021-03-15",
	"telefone": "7199989888",
    "email": "email2@bank.com",
    "senha": "123456"
}
```

#### Saída

```javascript
// HTTP Status 201
{
    numero:  "1",
    saldo: 0,
    usuario: {
        nome: 'Atol',
        cpf: '27633626488',
        data_nascimento: '2021-03-15',
        telefone: '7199989888',
        email: 'email2@bank.com',
        senha: '123456'
    }
}

// HTTP Status 400
{
    mensagem: 'Mensagem do erro!'
}
```

### Atualizar usuário da conta bancária

#### `PUT` `/contas/:numeroConta/usuario`

Esse endpoint atualiza apenas os dados do usuário de uma conta bancária. Podem ser passados um ou mais dados para serem atualizados, exceto o CPF, que caso seja passado no body da requisão será ignorado pelo código e não será alterado.

-   **DADOS**:

    -   A data de nascimento deve ser informada no formato yyyy-mm-dd.
    -   O telefone com DDD deve conter 10 ou 11 dígitos.
    -   A senha deve ser composta por apenas 6 números.

-   **VALIDAÇÕES**:

    -   Verifica se foi passado, ao menos, um campo no body da requisição.
    -   Verifica se o numero da conta passado como parâmetro na URL é válida.
    -   Se o E-mail for informado, verifica se já existe outro registro com o mesmo E-mail.
    -   Utiliza a biblioteca **email-validator** para validar o e-mail passado.
    -   Verifica a quantidade de dígitos passados no número de telefone.

-   Entradas

    -   Nome
    -   Data Nascimento
    -   Telefone
    -   Email
    -   Senha

-   Saída

    -   Sucesso ou erro

#### Entrada

```json
{
	"nome": "Fulano",
	"telefone": "71999998888",
    "email": "emailx@bank.com",
    "senha": "456123"
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Conta atualizada com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

### Excluir Conta

#### `DELETE` `/contas/:numeroConta?senha_banco=123Bank`

Esse endpoint exclui uma conta bancária existente. A conta é informada através do parâmetro de rota na URL, e deve ser passada a senha do banco como query params da URL da requisição.

-   **VALIDAÇÕES**:

    -   Verifica se a senha do banco foi informada (passado como query params na url).
    -   Valida se a senha do banco está correta.
    -   Verifica se o numero da conta passado como parâmetro na URL é válida.
    -   Permite excluir uma conta bancária apenas se o saldo for 0 (zero).

-   Entradas

    -   Numero da conta bancária (passado como parâmetro na rota)

-   Saida

    -   Sucesso ou erro

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Conta excluída com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

### Depositar

#### `POST` `/transacoes/depositar`

Esse endpoint soma o valor do depósito ao saldo de uma conta válida, e registra essa transação dentro do arquivo JSON. Os dados do valor depositado e da conta em que será efetuado o depósito são passados no body da requisição.

-   **VALIDAÇÕES**:

    -   Verifica se o numero da conta e o valor do deposito foram informados no body.
    -   Verifica se a conta bancária informada existe.
    -   Não é permitido depósitos com valores negativos ou zerados.
    -   Transforma o número da conta em string caso tenha sido passado como number.

-   Entrada

    -   Número da conta
    -   Valor (o valor é sempre passado em centavos)

#### Entrada

```json
{
	"numeroConta": "1",
	"valor": 10000 
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Depósito realizado com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

#### Registro de um depósito

```JSON
{
	"data": "30-07-2023 07:57:37",
	"numero_conta": "2",
	"valor": 30000
}
```

### Sacar

#### `POST` `/transacoes/sacar`

Esse endpoint realiza o saque de um valor em uma determinada conta bancária e registra essa transação dentro do arquivo JSON. Os dados do valor sacado, da conta em que será efetuado o saque, e a senha da conta são passados no body da requisição.

-   **VALIDAÇÕES**:

    -   Verifica se o numero da conta, o valor do saque e a senha foram informados no body.
    -   Verifica se a conta bancária informada existe.
    -   Verifica se a senha informada é uma senha válida para a conta informada.
    -   Verifica se há saldo disponível para saque.
    -   Transforma o número da conta em string caso tenha sido passado como number.

-   Entrada

    -   Número da conta
    -   Valor (o valor é sempre passado em centavos)
    -   Senha


#### Entrada

```JSON
{
	"numeroConta": "2",
	"valor": 100000,
	"senha": "123456"
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Saque realizado com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

#### Registro de um saque

```JSON
{
    "data": "30-07-2023 08:07:19",
    "numero_conta": "2",
    "valor": 200
}
```

### Tranferir

#### `POST` `/transacoes/transferir`

Esse endpoint permite a transferência de recursos (dinheiro) de uma conta bancária para outra e registra essa transação dentro do arquivo JSON. 
No body da requisição deverá ser passado o número da conta de origem, o número da conta de destino, o valor a ser transferido e a senha da conta de origem.

-   **VALIDAÇÕES**:

    -   Verifica se o número da conta de origem, de destino, senha da conta de origem e valor da transferência foram informados no body.
    -   Verifica se a conta bancária de origem e de destino informadas existem.
    -   Verifica se a senha informada é uma senha válida para a conta de origem informada.
    -   Verifica se há saldo disponível na conta de origem para a transferência.
    -   Transforma os números das contas em string caso tenha sido passado como number.

-   Entrada

    -   Número da conta (origem)
    -   Número da conta (destino)
    -   Valor (o valor é sempre passado em centavos)
    -   Senha da conta (origem)

#### Entrada

```JSON
{
	"numeroContaOrigem": "2", 
	"numeroContaDestino": "1",
	"valor": 1000,
	"senha": "123456"
}
```

#### Saída

```javascript
// HTTP Status 200
{
    mensagem: "Transferência realizada com sucesso!"
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

#### Registro de uma transferência

```JSON
{
    "data": "30-07-2023 08:08:24",
    "numero_conta_origem": "2",
    "numero_conta_destino": "1",
    "valor": 1000
}
```

### Saldo

#### `GET` `/contas/saldo/:numeroConta?senha=123456`

Esse endpoint retorna o saldo de uma conta bancária informada através do parâmetro de rota na URL, e deve ser passada a senha da conta como query params na URL da requisição.

-   **VALIDAÇÕES**:

    -   Verifica se o numero da conta e a senha foram informadas (passado como parâmetro de rota e query params na url).
    -   Verifica se a conta bancária informada existe.
    -   Verifica se a senha informada é uma senha válida.

-   Entrada (parâmetro de rota e query params)

    -   Número da conta
    -   Senha

-   Saída

    -   Saldo da conta


#### Saída

```javascript
// HTTP Status 200
{
    saldo: 13000
}

// HTTP Status 400, 404
{
    mensagem: "Mensagem do erro!"
}
```

### Extrato

#### `GET` `/contas/extrato/:numeroConta?senha=123456`

Esse endpoint lista as transações realizadas de uma conta específica informada no parâmetro de rota na URL. A senha deverá ser passada como query params da URL.

-   **VALIDAÇÕES**:

    -   Verifica se o numero da conta e a senha foram informadas (passado como parâmetro de rota e query params na url).
    -   Verifica se a conta bancária informada existe.
    -   Verifica se a senha informada é uma senha válida.
    -   Retorna a lista de transferências, depósitos e saques da conta em questão.

-   Entrada (parâmetro de rota e query params)

    -   Número da conta
    -   Senha

-   Saída
    -   Relatório da conta


#### Saída

```JSON
// HTTP Status 200
{
	"depositos": [
		{
			"data": "30-07-2023 07:57:37",
			"numero_conta": "2",
			"valor": 30000
		}
	],
	"saques": [
		{
			"data": "30-07-2023 08:07:19",
			"numero_conta": "2",
			"valor": 200
		}
	],
	"transferencias_enviadas": [
		{
			"data": "30-07-2023 08:08:24",
			"numero_conta_origem": "2",
			"numero_conta_destino": "1",
			"valor": 1000
		}
	],
	"transferencias_recebidas": [
        {
            "data": "2021-08-18 20:47:24",
            "numero_conta_origem": "2",
            "numero_conta_destino": "1",
            "valor": 2000
        }
    ]
}

// HTTP Status 400, 404
{
    "mensagem": "Mensagem do erro!"
}
```