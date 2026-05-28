# JS — Programação Orientada a Objetos (2026)

Repositório de aulas e mini projetos práticos do módulo de **POO com JavaScript**, cobrindo desde os fundamentos da orientação a objetos até a construção de APIs REST com Node.js, autenticação e upload de imagens.

---

## Estrutura do repositório

```
JS___POO__2026/
│
├── 1_POO vs Estruturada/          # Aula 1 — Comparação de paradigmas
│   └── JS/
│       ├── estruturada.js         # Exemplo com variáveis soltas e funções globais
│       ├── poo.js                 # Mesmo problema resolvido com classe e encapsulamento
│       └── varios_poo.js          # Criando múltiplos objetos com array e forEach
│
├── 2_Pilares/                     # Aula 2 — Os 4 pilares da POO
│   └── JS/
│       ├── abstracao.js
│       ├── encapsulamento.js
│       ├── heranca.js
│       └── polimorfismo.js
│
├── 3_Mini-exercicio/              # Exercício prático — Sistema de Pedidos
│   ├── ex_1.md                    # Enunciado
│   └── ex_1_solucao.js            # Solução comentada
│
├── 4_mvc/                         # Mini 1 — MVC com banco de dados (MySQL)
│   └── mini1-mvc/
│
├── 5_perfis/                      # Mini 2 — Autenticação e controle de perfis
│   └── mini2-perfis/
│
├── 6_imagens/                     # Mini 3 — Upload de imagens com Multer
│   └── mini3-imagens/
│
└── mini-exercicios-preparatorios.md  # Guia passo a passo dos Minis 4, 5 e 6
```

---

## Aula 1 — POO vs Programação Estruturada

Apresenta o mesmo problema (gerenciar cachorros) resolvido de duas formas diferentes, deixando clara a diferença entre os paradigmas.

**Programação Estruturada** (`estruturada.js`): dados ficam em variáveis soltas (`nomeCachorro1`, `comidaCachorro1`) e funções globais que não têm relação formal com esses dados. À medida que o programa cresce, rastrear quem altera o quê se torna difícil.

**Programação Orientada a Objetos** (`poo.js`): dados e comportamentos ficam dentro da classe `Cachorro`. Atributos são privados (`#nome`, `#comida`, `#sono`), acessados apenas por getters. Cada cachorro é um objeto independente criado com `new`.

`varios_poo.js` dá um passo além: cria um array de vários objetos `Cachorro` e usa `forEach` para chamar `comer()` em todos de uma vez, mostrando como POO escala naturalmente.

---

## Aula 2 — Os 4 Pilares da POO

Cada arquivo isola e demonstra um pilar, usando o contexto de animais para facilitar a compreensão.

### Abstração (`abstracao.js`)

A classe `Animal` define métodos genéricos (`fazerSom`, `mover`) que lançam um `Error` se chamados diretamente. Isso obriga as classes filhas a fornecerem sua própria implementação — o contrato que a abstração estabelece.

```js
class Animal {
    fazerSom() { throw new Error("Método obrigatório."); }
    mover()    { throw new Error("Método obrigatório."); }
}

class Cachorro extends Animal {
    fazerSom() { return "Au au!"; }
    mover()    { return "Andando com 4 patas"; }
}
```

### Encapsulamento (`encapsulamento.js`)

O atributo `#nome` usa a sintaxe de campo privado nativa do JavaScript (ES2022+). Tentar acessar `rex.#nome` fora da classe lança um `SyntaxError`. O getter `getNome()` é o único ponto de acesso controlado.

```js
class Cachorro {
    #nome;
    constructor(nome) { this.#nome = nome; }
    getNome() { return this.#nome; }
}
```

### Herança (`heranca.js`)

`Cachorro extends Animal` herda o construtor e o método `dormir()` sem precisar reescrevê-los. A subclasse acrescenta apenas o que é exclusivo dela (`latir()`).

```js
class Animal {
    constructor(nome) { this.nome = nome; }
    dormir() { return `${this.nome} está dormindo.`; }
}

class Cachorro extends Animal {
    latir() { return `${this.nome} fez: Au au!`; }
}
```

### Polimorfismo (`polimorfismo.js`)

`Cachorro` e `Gato` herdam de `Animal` e cada um sobrescreve `fazerSom()` com seu próprio comportamento. A função `comunicarAnimal(animal)` funciona com qualquer objeto que tenha esse método — não importa o tipo concreto.

```js
function comunicarAnimal(animal) {
    return animal.fazerSom();
}

comunicarAnimal(new Cachorro()); // "Au au!"
comunicarAnimal(new Gato());    // "Miau!"
```

---

## Exercício Prático — Sistema de Pedidos (`3_Mini-exercicio/`)

Exercício que aplica os 4 pilares em conjunto, simulando um sistema de pedidos de lanchonete.

| Pilar | Aplicação |
|---|---|
| Abstração | Classe base `Pedido` com `mostrarPedido()` genérico |
| Encapsulamento | Atributo `#cliente` privado + getter `getCliente()` |
| Herança | `PedidoLanche` e `PedidoPizza` estendem `Pedido` |
| Polimorfismo | Cada subclasse sobrescreve `mostrarPedido()` com mensagem própria |

A função `exibirPedido(pedido)` é **polimórfica**: recebe qualquer tipo de pedido e chama `mostrarPedido()` sem saber qual classe está por trás.

---

## Mini 1 — MVC com Banco de Dados (`4_mvc/mini1-mvc/`)

Primeira API REST com Node.js, Express e MySQL, organizada em camadas MVC.

**Dependências:** `express`, `mysql2`, `dotenv`

### Estrutura de pastas

```
mini1-mvc/
├── .env                  ← Credenciais do banco (não sobe para o Git)
├── server.js             ← Ponto de entrada: configura Express e middlewares
├── config/
│   └── db.js             ← Pool de conexões MySQL com suporte a async/await
├── routes/
│   └── api.js            ← Mapeia GET /api/itens → ItemController.listar
├── controllers/
│   └── ItemController.js ← Lê query string, chama Model, devolve JSON
├── models/
│   └── Item.js           ← Queries ao banco: buscarTodos() e buscarPorNome()
└── views/
    └── index.html        ← Frontend: busca dados via fetch e renderiza
```

### Conceitos introduzidos

**Pool de conexões:** em vez de abrir e fechar uma conexão por query, o pool mantém um conjunto de conexões reutilizáveis. `pool.promise()` converte as chamadas para trabalhar com `async/await`.

**async/await:** o banco é assíncrono — a query é enviada e o resultado chega depois. `await` pausa a função até o resultado estar disponível, sem bloquear o restante do servidor.

**Destructuring `[rows]`:** `pool.query()` retorna `[rows, fields]`. Usar `const [rows] = await pool.query(...)` pega só as linhas, ignorando os metadados.

**Prepared statements:** o `?` na query é substituído pelo `mysql2` de forma segura, prevenindo SQL Injection. Nunca concatene valores do usuário diretamente na string da query.

### Rotas disponíveis

| Método | URL | Ação |
|---|---|---|
| GET | `/api/itens` | Lista todos os itens |
| GET | `/api/itens?busca=termo` | Filtra itens por nome (LIKE) |

---

## Mini 2 — Autenticação e Perfis (`5_perfis/mini2-perfis/`)

Adiciona login com senha hasheada, sessão e controle de acesso por perfil ao padrão MVC do Mini 1.

**Dependências:** `express`, `mysql2`, `dotenv`, `bcrypt`, `express-session`

### Estrutura de pastas

```
mini2-perfis/
├── .env
├── server.js
├── config/
│   └── db.js
├── middleware/
│   └── auth.js            ← Verifica se há sessão ativa antes de liberar a rota
├── routes/
│   └── api.js             ← Separa rotas públicas e rotas protegidas
├── controllers/
│   ├── AuthController.js  ← Login e logout
│   └── PainelController.js
├── models/
│   └── Usuario.js         ← buscarPorUsuario() e validarSenha() com bcrypt
├── seed.js                ← Popula o banco com usuários de teste
└── views/
    ├── login.html
    └── painel.html
```

### Conceitos introduzidos

**bcrypt:** algoritmo de hash de mão única para senhas. O banco guarda o hash, nunca a senha original. `bcrypt.compare(senhaDigitada, hashNoBanco)` refaz o processo internamente e retorna `true` ou `false`. O salt aleatório garante que dois usuários com a mesma senha tenham hashes diferentes.

**express-session:** HTTP é stateless por natureza. A sessão resolve isso: após o login, `req.session.usuario` e `req.session.perfil` ficam disponíveis em todas as requisições seguintes enquanto o cookie for válido.

**Middleware de autenticação (`auth.js`):** função que roda antes do controller em rotas protegidas. Se `req.session.usuario` não existir, redireciona para `/login`. Caso contrário, chama `next()` e passa o controle adiante.

**Boa prática de segurança:** o `AuthController` retorna a mesma mensagem de erro para "usuário não encontrado" e "senha incorreta", evitando que um atacante descubra quais usuários existem no sistema.

### Fluxo de login

```
POST /login
  → AuthController.login()
    → Usuario.buscarPorUsuario()   [busca no banco]
    → Usuario.validarSenha()       [bcrypt.compare]
    → req.session.usuario = dados  [cria sessão]
    → redirect /painel
```

### Rotas disponíveis

| Método | URL | Proteção | Ação |
|---|---|---|---|
| GET | `/login` | Pública | Exibe formulário de login |
| POST | `/login` | Pública | Processa credenciais e cria sessão |
| GET | `/painel` | Sessão obrigatória | Exibe painel do usuário |
| GET | `/api/painel` | Sessão obrigatória | Retorna dados do perfil em JSON |
| POST | `/logout` | — | Destrói sessão e redireciona |

---

## Mini 3 — Upload de Imagens (`6_imagens/mini3-imagens/`)

Estende o Mini 1 com a capacidade de cadastrar itens com foto, usando o Multer para processar o upload.

**Dependências:** `express`, `mysql2`, `dotenv`, `multer`

### Estrutura de pastas

```
mini3-imagens/
├── .env
├── server.js
├── config/
│   ├── db.js
│   └── upload.js          ← Configuração do Multer (destino, nome, filtro, limite)
├── routes/
│   └── api.js
├── controllers/
│   └── ItemController.js  ← cadastrar() e listar()
├── models/
│   └── Item.js
├── uploads/               ← Arquivos salvos pelo Multer (não sobe para o Git)
└── views/
    └── index.html
```

### Conceitos introduzidos

**Multer:** middleware para requisições `multipart/form-data` (o tipo usado quando um `<form>` envia arquivos). Sem ele, `req.body` não consegue ler arquivos.

**diskStorage:** define onde e com que nome o arquivo é salvo. O nome combina `Date.now()` com um número aleatório para evitar colisões entre arquivos com o mesmo nome original.

**fileFilter:** função que aceita ou rejeita o arquivo antes de salvá-lo. Aqui, apenas tipos que começam com `image/` são aceitos. PDFs, executáveis e outros são rejeitados imediatamente.

**Servindo arquivos estáticos:** `app.use('/uploads', express.static('uploads/'))` faz com que as imagens salvas sejam acessíveis via URL (`/uploads/nome-do-arquivo.jpg`), permitindo que a tag `<img src="...">` do frontend carregue as imagens corretamente.

**O banco guarda o caminho, não o arquivo:** o campo `foto` na tabela armazena a string `"uploads/1714900_49.jpg"`. O arquivo em si fica no disco, na pasta `uploads/`.

### Rotas disponíveis

| Método | URL | Ação |
|---|---|---|
| GET | `/api/itens` | Lista todos os itens com caminho da imagem |
| POST | `/api/itens` | Cadastra item com nome e foto (`multipart/form-data`) |

---

## Pré-requisitos para rodar os Minis (4, 5 e 6)

**1. Criar os bancos no MySQL:**

```sql
CREATE DATABASE IF NOT EXISTS mini_mvc;
CREATE DATABASE IF NOT EXISTS mini_imagens;
```

**2. Instalar as dependências de cada mini:**

```bash
cd mini1-mvc && npm install
cd mini2-perfis && npm install
cd mini3-imagens && npm install
```

**3. Configurar o `.env` de cada mini** com as credenciais do seu MySQL local (veja o modelo `.env.example` em cada pasta).

**4. Iniciar o servidor:**

```bash
node server.js
```

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| JavaScript (ES2022+) | Linguagem principal; campos privados com `#` |
| Node.js | Ambiente de execução server-side |
| Express 5 | Framework web para as APIs REST |
| MySQL 2 | Driver de banco de dados com suporte a Promises |
| bcrypt | Hash de senhas |
| express-session | Gerenciamento de sessão HTTP |
| Multer | Upload de arquivos `multipart/form-data` |
| dotenv | Carregamento de variáveis de ambiente |
