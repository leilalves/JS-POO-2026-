# 🧪 Mini Exercícios Preparatórios — Conceitos Essenciais

> **Como usar este guia:**
> Siga cada mini na ordem. O Mini 5 é construído em cima do Mini 4 — não pule.
> Ao final de cada um há um ✅ **Teste** para confirmar o entendimento antes de avançar.
> Cada mini tem estrutura real Node/Express com banco de dados — igual ao projeto principal.

---

# Antes de começar — Preparar o banco de dados

> Todos os minis usam MySQL. Antes de rodar qualquer mini, o banco precisa existir.
> Execute os comandos abaixo uma única vez no MySQL Workbench ou terminal MySQL.

```sql
-- Banco do Mini 4 e Mini 5
CREATE DATABASE IF NOT EXISTS mini_mvc;

-- Banco do Mini 6 (imagens) — isolado
CREATE DATABASE IF NOT EXISTS mini_imagens;
```

---

# MINI 4 — Estrutura MVC com Banco de Dados

> **Conceito:** MVC separa o código em três responsabilidades bem definidas:
>
> - **Model** → acessa o banco de dados e expõe métodos de consulta
> - **Controller** → recebe a requisição, chama o Model e devolve a resposta
> - **View** → o HTML que o usuário vê, busca dados via fetch e renderiza
>
> Neste mini o Model já faz queries reais com `mysql2`.
> O `async/await` aparece aqui pela primeira vez — leia o bloco de explicação
> antes de abrir o `Item.js`.

## 📂 Estrutura de pastas

```text
mini1-mvc/
├── .env                   ← Variáveis de ambiente (credenciais do banco)
├── server.js              ← Ponto de entrada
├── config/
│   └── db.js              ← Configura e exporta o pool de conexões MySQL
├── routes/
│   └── api.js             ← Mapeia URLs para Controllers
├── controllers/
│   └── ItemController.js  ← Recebe requisição, chama Model, responde
├── models/
│   └── Item.js            ← Queries ao banco de dados
└── views/
    └── index.html         ← Frontend: busca dados via fetch e exibe
```

## 1.1 — Criar pastas, arquivos e instalar dependências

```bash
mkdir -p mini1-mvc/config mini1-mvc/routes mini1-mvc/controllers mini1-mvc/models mini1-mvc/views
cd mini1-mvc
npm init -y
npm install express mysql2 dotenv

# Cria todos os arquivos em branco de uma vez
touch .env config/db.js routes/api.js controllers/ItemController.js models/Item.js views/index.html server.js
```

## 1.2 — Criar a tabela no banco

```sql
-- Execute no MySQL Workbench ou terminal MySQL
USE mini_mvc;

CREATE TABLE IF NOT EXISTS itens (
  id   INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL
);

INSERT INTO itens (nome) VALUES ('Notebook'), ('Mouse'), ('Teclado');
```

---

## 📄 Arquivo: `.env`

> Guarda as credenciais do banco fora do código.
> Nunca sobe para o Git — adicione `.env` no `.gitignore`.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Senai@118
DB_NAME=mini_mvc
PORT=3000
```

---

## 📄 Arquivo: `config/db.js`

> **Papel:** Cria e exporta o pool de conexões com o banco.
> Um pool reutiliza conexões abertas em vez de abrir uma nova a cada query — mais eficiente e mais próximo do que a Locadora usa.

```javascript
// ============================================================
// config/db.js — POOL DE CONEXÕES
//
// Um "pool" é um conjunto de conexões abertas com o banco
// que ficam disponíveis para reutilização.
//
// Sem pool: cada query abre uma conexão, faz a query, fecha.
// Com pool: as conexões ficam abertas e são reutilizadas.
//           Mais rápido e mais eficiente sob múltiplas requisições.
//
// .promise() → converte o pool para trabalhar com async/await
// em vez de callbacks. É isso que permite escrever:
//   const [rows] = await pool.query('SELECT ...')
// no lugar de:
//   pool.query('SELECT ...', function(err, rows) { ... })
//
// Este arquivo é idêntico ao config/db.js da Locadora.
// ============================================================

// Carrega as variáveis do arquivo .env para process.env
require('dotenv').config();

const mysql = require('mysql2');

// Cria o pool com as credenciais vindas do .env
// Nunca coloque usuário e senha diretamente aqui
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Exporta o pool com suporte a Promise (async/await)
module.exports = pool.promise();
```

---

## 📄 Arquivo: `models/Item.js`

> **Papel no MVC:** Model. Faz as queries ao banco. Não sabe nada de HTTP ou HTML.

```javascript
// ============================================================
// models/Item.js — MODEL
//
// O Model é o único arquivo que fala com o banco de dados.
// Controllers, rotas e Views nunca importam o pool diretamente
// — eles sempre passam pelo Model.
//
// ── ENTENDENDO async/await ───────────────────────────────────
//
// Banco de dados é uma operação assíncrona: o JavaScript envia
// a query e continua rodando — o resultado chega "depois".
//
// Sem async/await (jeito antigo com callbacks):
//   pool.query('SELECT * FROM itens', function(erro, linhas) {
//     // resultado disponível aqui dentro
//   });
//   // código aqui roda ANTES do resultado chegar — problema!
//
// Com async/await (jeito atual):
//   const [linhas] = await pool.query('SELECT * FROM itens');
//   // await pausa só esta função até o resultado chegar
//   // o restante do programa continua normalmente
//
// Regra: toda função que usa await precisa ser declarada
// com async. Por isso os métodos abaixo têm "static async".
//
// ── ENTENDENDO o destructuring [rows] ────────────────────────
//
// pool.query() retorna um array com dois elementos:
//   [rows, fields]
//   rows   → as linhas retornadas pela query (o que queremos)
//   fields → metadados das colunas (quase nunca precisamos)
//
// const [rows] = await pool.query(...) pega só o primeiro item.
// É equivalente a:
//   const resultado = await pool.query(...)
//   const rows = resultado[0]
//
// ── ENTENDENDO prepared statements (?) ───────────────────────
//
// NUNCA concatene valores do usuário diretamente na query:
//   'SELECT * FROM itens WHERE nome = "' + termo + '"'  ← ERRADO
//
// Isso permite SQL Injection — o usuário pode digitar:
//   " OR "1"="1   e apagar todo o banco.
//
// Use sempre o ? como placeholder:
//   pool.query('SELECT * FROM itens WHERE nome LIKE ?', [`%${termo}%`])
//
// O mysql2 substitui o ? de forma segura, escapando os valores.
// ============================================================






// 1º Digitar o código (Feito pelo Professor - AQUI)






  // ── buscarTodos() ─────────────────────────────────────────
  // Retorna todos os itens da tabela.
  // Equivalente a: SELECT * FROM itens
  // ─────────────────────────────────────────────────────────
 





  // 2º Digitar o código (Feito pelo Professor - AQUI)






  // ── buscarPorNome(termo) ──────────────────────────────────
  // Filtra itens pelo nome usando LIKE.
  // O % antes e depois do termo significa "qualquer coisa
  // antes e depois" — busca parcial, não exata.
  //
  // Equivalente a: SELECT * FROM itens WHERE nome LIKE '%termo%'
  // ─────────────────────────────────────────────────────────



// 3º Digitar o código (Feito pelo Professor - AQUI)




    // O ? é substituído pelo valor do array de forma segura






// 4º Digitar o código (Feito pelo Professor - AQUI)







```

---

## 📄 Arquivo: `controllers/ItemController.js`

> **Papel no MVC:** Controller. Coordena o fluxo — lê a requisição, chama o Model e responde. Agora usa `async/await` porque o Model é assíncrono.

```javascript
// ============================================================
// controllers/ItemController.js — CONTROLLER
//
// O Controller agora é async porque precisa aguardar
// a resposta do banco antes de responder ao cliente.
//
// try/catch substitui o if(erro) dos callbacks:
//   try   → tudo correu bem, responde com os dados
//   catch → algo deu errado (banco fora, query errada...),
//           responde com erro 500
//
// O Controller NÃO sabe como a query é feita — isso é do Model.
// O Controller NÃO sabe como o HTML é montado — isso é da View.
// ============================================================





// 5º Digitar o código (Feito pelo Professor - AQUI)





  // ── listar(req, res) ──────────────────────────────────────
  // Chamado por: GET /api/itens?busca=termo
  // ─────────────────────────────────────────────────────────




  // 6º Digitar o código (Feito pelo Professor - AQUI)




      // await pausa aqui até o banco responder



    // 7º Digitar o código (Feito pelo Professor - AQUI)



      // Qualquer erro do banco cai aqui
      // Em produção: logar o erro, não expor detalhes ao cliente



      // 8º Digitar o código (Feito pelo Professor - AQUI)






```

---

## 📄 Arquivo: `routes/api.js`

```javascript
// ============================================================
// routes/api.js — ROTAS
//
// Conecta URLs aos Controllers.
// Não contém lógica — só a ligação: URL → Controller.
// ============================================================





// 9º Digitar o código (Feito pelo Professor - AQUI)





// GET /api/itens        → lista todos
// GET /api/itens?busca= → filtra por nome





// 10º Digitar o código (Feito pelo Professor - AQUI)




```

---

## 📄 Arquivo: `server.js`

```javascript
// ============================================================
// server.js — PONTO DE ENTRADA
//
// Responsabilidades:
//   1. Carregar variáveis de ambiente (.env)
//   2. Criar a aplicação Express
//   3. Configurar middlewares globais
//   4. Registrar as rotas
//   5. Servir arquivos estáticos (views/)
//   6. Subir o servidor
//
// Não contém lógica de negócio, queries ou HTML.
// ============================================================

// Carrega o .env antes de qualquer outra coisa
// process.env.PORT, process.env.DB_HOST etc só existem após isso





// 11º Digitar o código (Feito pelo Professor - AQUI)






// ── MIDDLEWARES GLOBAIS ───────────────────────────────────────

// Lê body em formato JSON (fetch com JSON.stringify)


// Lê body de formulários HTML (<form method="POST">)


// Serve a pasta views/ como arquivos estáticos
// views/index.html fica acessível em http://localhost:3000



// ── ROTAS ────────────────────────────────────────────────────
// Todas as rotas da API ficam sob o prefixo /api



// ── SERVIDOR ─────────────────────────────────────────────────



```

---

## 📄 Arquivo: `views/index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Mini 1 — MVC</title>
</head>
<body>

  <h2>Lista de Itens</h2>

  <input id="busca" placeholder="Buscar..." oninput="buscar()">

  <ul id="lista"></ul>

  <script>
    // ── VIEW (frontend) ───────────────────────────────────────
    // Responsabilidade única: chamar a API e renderizar o resultado.
    // Não sabe como os dados foram buscados nem de onde vieram.
    // ─────────────────────────────────────────────────────────

    function buscar() {
      const termo = document.getElementById('busca').value;

      fetch('/api/itens?busca=' + termo)
        .then(res => res.json())
        .then(itens => {
          document.getElementById('lista').innerHTML =
            itens.map(i => '<li>' + i.nome + '</li>').join('');
        })
        .catch(() => {
          document.getElementById('lista').innerHTML =
            '<li>Erro ao carregar itens.</li>';
        });
    }

    buscar();
  </script>

</body>
</html>
```

---

## ✅ Teste do Mini 4

```bash
node server.js
```

Acesse `http://localhost:3000` e use o campo de busca.

**Diagrama do fluxo:**

```
Usuário digita "mo"
        ↓
views/index.html → fetch('/api/itens?busca=mo')
        ↓
server.js → routes/api.js → ItemController.listar()
        ↓
await Item.buscarPorNome('mo')
        ↓
pool.query('SELECT * FROM itens WHERE nome LIKE ?', ['%mo%'])
        ↓
MySQL retorna [{ id: 2, nome: 'Mouse' }]
        ↓
res.json([{ id: 2, nome: 'Mouse' }])
        ↓
index.html renderiza: <li>Mouse</li>
```
<br>
<div>
    <img src="./diag-fluxo-04-mvc.png" width="400">
</div>
<br>

**Pergunta para fixar:** Por que os métodos do Model são `async` e o Controller usa `await`? (Resposta: banco de dados é assíncrono — o resultado não chega instantaneamente. `await` pausa a execução até o banco responder, sem travar o servidor.)

---

---

# MINI 5 — Login por Perfis (MVC + Banco de Dados)

> **Conceito:** O Mini 4 mostrou MVC com banco. Agora adicionamos autenticação e controle de acesso por perfil em cima da mesma estrutura. Os usuários vêm do banco, a senha é protegida com bcrypt e a sessão guarda o perfil entre requisições.

## 📂 Estrutura de pastas

```text
mini2-perfis/
├── .env                       ← Credenciais do banco e secret da sessão
├── server.js                  ← Ponto de entrada
├── config/
│   └── db.js                  ← Pool de conexões (igual ao Mini 1)
├── routes/
│   └── api.js                 ← Rotas públicas e protegidas
├── middleware/
│   └── auth.js                ← verificarSessao: protege rotas
├── controllers/
│   ├── AuthController.js      ← Login e logout
│   └── PainelController.js    ← Dados do painel por perfil
├── models/
│   └── Usuario.js             ← Queries de usuário + validação de senha
└── views/
    ├── login.html             ← Formulário de login
    └── painel.html            ← Página protegida por perfil
```

## 2.1 — Criar pastas, arquivos e instalar dependências

```bash
mkdir -p mini2-perfis/config mini2-perfis/routes mini2-perfis/middleware mini2-perfis/controllers mini2-perfis/models mini2-perfis/views
cd mini2-perfis
npm init -y
npm install express mysql2 dotenv express-session bcrypt

# Cria todos os arquivos em branco de uma vez
touch .env config/db.js routes/api.js middleware/auth.js controllers/AuthController.js controllers/PainelController.js models/Usuario.js views/login.html views/painel.html server.js
```

## 2.2 — Criar a tabela e inserir usuários no banco

```sql
-- Execute no MySQL Workbench ou terminal MySQL
USE mini_mvc;

CREATE TABLE IF NOT EXISTS usuarios (
  id       INT AUTO_INCREMENT PRIMARY KEY,
  usuario  VARCHAR(50)  NOT NULL UNIQUE,
  senha    VARCHAR(255) NOT NULL,
  perfil   ENUM('admin', 'gerente', 'cliente') NOT NULL
);
```

> ⚠️ **Não insira senhas em texto puro.** O script abaixo gera os hashes e insere os usuários corretamente. Execute-o uma única vez.

## 2.3 — Script para criar usuários com senha hashada

> Crie o arquivo `seed.js` na raiz do projeto, rode uma vez e apague.

```javascript
// seed.js — executa uma vez para popular a tabela de usuários
// Após rodar: node seed.js
// Pode apagar este arquivo depois.

require('dotenv').config();
const bcrypt = require('bcrypt');
const pool   = require('./config/db');

async function criarUsuarios() {

  // bcrypt.hash(senha, saltRounds)
  // saltRounds → quantas vezes o algoritmo roda (10 é o padrão)
  // Quanto maior, mais seguro e mais lento
  // O hash gerado é diferente a cada chamada — isso é intencional
  const senhaHash = await bcrypt.hash('123', 10);

  await pool.query(`
    INSERT INTO usuarios (usuario, senha, perfil) VALUES
      ('admin',   ?, 'admin'),
      ('gerente', ?, 'gerente'),
      ('cliente', ?, 'cliente')
  `, [senhaHash, senhaHash, senhaHash]);

  console.log('Usuários criados com sucesso.');
  process.exit();
}

criarUsuarios();
```

Antes de rodar: 
## 📄 Adicione o conteúdo de: `config/db.js` e `.env`

```bash
node seed.js
```

---

## 📄 Arquivo: `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Senai@118
DB_NAME=mini_mvc
SESSION_SECRET=segredo_longo_e_aleatorio_aqui
PORT=3000
```

---

## 📄 Arquivo: `config/db.js`

> Idêntico ao Mini 1. Se quiser reaproveitar, copie o arquivo.

```javascript
// ============================================================
// config/db.js — POOL DE CONEXÕES
// Idêntico ao Mini 1 — mesma lógica, mesmo banco (mini_mvc).
// ============================================================

require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool.promise();
```

---

## 📄 Arquivo: `models/Usuario.js`

> **Papel no MVC:** Model. Busca usuários no banco e valida senha com bcrypt.

```javascript
// ============================================================
// models/Usuario.js — MODEL
//
// Cuida de tudo relacionado aos dados de usuário:
//   - buscar pelo nome de login
//   - validar a senha com bcrypt
//
// ── ENTENDENDO bcrypt ─────────────────────────────────────────
//
// bcrypt é um algoritmo de hash para senhas.
// Hash ≠ criptografia:
//   - Criptografia: você pode reverter (descriptografar)
//   - Hash: processo de mão única — não dá para "desfazer"
//
// O que o banco guarda: o hash ($2b$10$xK9mP...)
// O que o usuário digita: a senha original (123)
//
// bcrypt.compare(senhaDigitada, hashNoBanco) refaz o processo
// e verifica se o resultado bate — sem nunca "revelar" a original.
//
// Por que o hash é diferente a cada vez?
//   bcrypt adiciona um "salt" aleatório antes de hashar.
//   Isso impede ataques de dicionário — dois usuários com a
//   mesma senha terão hashes completamente diferentes.
//
// bcrypt.compare() é async — retorna uma Promise.
// Por isso validarSenha() também precisa ser async.
// ============================================================

const pool   = require('../config/db');
const bcrypt = require('bcrypt');


class Usuario {

  // ── buscarPorUsuario(usuario) ─────────────────────────────
  // Busca um usuário pelo nome de login.
  // Equivalente a: SELECT * FROM usuarios WHERE usuario = ?
  //
  // Retorna o objeto do usuário ou undefined se não existir.
  // ─────────────────────────────────────────────────────────
  static async buscarPorUsuario(usuario) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE usuario = ?',
      [usuario]
    );

    // rows[0] → primeiro (e único) resultado, ou undefined
    return rows[0];
  }


  // ── validarSenha(senhaDigitada, hashNoBanco) ──────────────
  // Compara a senha digitada com o hash armazenado no banco.
  //
  // bcrypt.compare() retorna true se bater, false se não bater.
  // É async porque o processo de comparação é computacionalmente
  // intenso (por design — dificulta ataques de força bruta).
  // ─────────────────────────────────────────────────────────
  static async validarSenha(senhaDigitada, hashNoBanco) {
    return bcrypt.compare(senhaDigitada, hashNoBanco);
  }

}

module.exports = Usuario;
```

---

## 📄 Arquivo: `middleware/auth.js`

```javascript
// ============================================================
// middleware/auth.js — MIDDLEWARE DE AUTENTICAÇÃO
//
// Função que roda ANTES do Controller em rotas protegidas.
// Se não houver sessão ativa → redireciona para /login.
// Se houver sessão → next() passa para o Controller.
//
// Assinatura padrão de middleware Express: (req, res, next)
//   req  → dados da requisição (inclui req.session)
//   res  → objeto para enviar resposta
//   next → passa o controle para o próximo passo
//
// Uso em routes/api.js:
//   router.get('/painel', verificarSessao, PainelController.dados)
//                          ↑ roda primeiro    ↑ só roda se passar
// ============================================================



// 12º Digitar o código (Feito pelo Professor - AQUI)




  // req.session.usuario só existe após AuthController.login()
  // ter salvo os dados — se não existe, não há sessão ativa





```

---

## 📄 Arquivo: `controllers/AuthController.js`

```javascript
// ============================================================
// controllers/AuthController.js — CONTROLLER DE AUTENTICAÇÃO
//
// Gerencia login e logout.
// Fluxo do login:
//   1. Lê usuário e senha do req.body
//   2. Busca o usuário no banco via Model
//   3. Compara a senha com o hash via Model (bcrypt)
//   4. Se válido: salva perfil na sessão e redireciona
//   5. Se inválido: devolve mensagem de erro
//
// async/await aqui porque buscarPorUsuario() e validarSenha()
// são operações assíncronas (banco + bcrypt).
// ============================================================




// 13º Digitar o código (Feito pelo Professor - AQUI)





      // Busca o usuário no banco
      

      // Mesma mensagem para "usuário não existe" e "senha errada"
      // Não revelar qual dos dois falhou é boa prática de segurança
      


      // ── CRIANDO A SESSÃO ──────────────────────────────────
      // req.session persiste entre requisições enquanto a
      // sessão estiver ativa (cookie válido no navegador).
      // O campo "perfil" é usado pelo middleware e pelo
      // PainelController para controlar o acesso.
      // ─────────────────────────────────────────────────────



  
    // Destrói a sessão no servidor — cookie do navegador fica inválido






```

---

## 📄 Arquivo: `controllers/PainelController.js`

```javascript
// ============================================================
// controllers/PainelController.js — CONTROLLER DO PAINEL
//
// Devolve os dados do usuário logado ao frontend.
// Só chega aqui se verificarSessao() deixou passar.
//
// req.session.perfil → 'admin' | 'gerente' | 'cliente'
// O frontend usa esse valor para exibir os blocos corretos.
//
// A proteção real está no backend (middleware + controller).
// O frontend aplica visibilidade — mas não é a barreira real.
// ============================================================

class PainelController {

  static dados(req, res) {
    const { usuario, perfil } = req.session;
    res.json({ usuario, perfil });
  }

}

module.exports = PainelController;
```

---

## 📄 Arquivo: `routes/api.js`

```javascript
// ============================================================
// routes/api.js — ROTAS
//
// Rotas públicas  → acessíveis sem login
// Rotas protegidas → verificarSessao roda antes do Controller
//
// Leitura de cada linha:
//   router.MÉTODO('caminho', [middleware?], Controller.método)
// ============================================================

const express             = require('express');
const router              = express.Router();
const path                = require('path');
const { verificarSessao } = require('../middleware/auth');
const AuthController      = require('../controllers/AuthController');
const PainelController    = require('../controllers/PainelController');


// ── ROTAS PÚBLICAS ────────────────────────────────────────────

// Exibe o formulário de login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Processa as credenciais e cria a sessão
router.post('/login', AuthController.login);


// ── ROTAS PROTEGIDAS ─────────────────────────────────────────
// verificarSessao barra quem não está logado antes de chegar
// ao Controller

// Serve o HTML do painel
router.get('/painel', verificarSessao, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/painel.html'));
});

// API que o painel.html chama via fetch para saber o perfil
router.get('/api/painel', verificarSessao, PainelController.dados);

// Destrói a sessão
router.post('/logout', AuthController.logout);


module.exports = router;
```

---

## 📄 Arquivo: `server.js`

```javascript
// ============================================================
// server.js — PONTO DE ENTRADA
//
// Responsabilidades:
//   1. Carregar .env
//   2. Criar app Express
//   3. Middlewares globais (json, urlencoded, session)
//   4. Registrar rotas
//   5. Subir servidor
//
// Não contém lógica de negócio, queries ou HTML.
// ============================================================

require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path    = require('path');
const rotas   = require('./routes/api');

const app = express();


// ── MIDDLEWARES GLOBAIS ───────────────────────────────────────

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express-session mantém o usuário "logado" entre requisições.
// HTTP é stateless por natureza — a sessão resolve isso.
//
// secret            → assina o cookie (use valor longo no .env)
// resave            → false: não salva sessão sem alteração
// saveUninitialized → false: não cria sessão para não-logados
app.use(session({
  secret:            process.env.SESSION_SECRET,
  resave:            false,
  saveUninitialized: false
}));


// ── ROTAS ────────────────────────────────────────────────────
app.use('/', rotas);


// ── SERVIDOR ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mini 2 — Perfis rodando em http://localhost:${PORT}/login`);
});
```

---

## 📄 Arquivo: `views/login.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Login</title>
</head>
<body>

  <h2>Login</h2>

  <!--
    action="/login" method="POST"
    Envia usuário e senha para AuthController.login() via req.body
  -->
  <form action="/login" method="POST">

    <label>Usuário:
      <select name="usuario">
        <option value="admin">admin</option>
        <option value="gerente">gerente</option>
        <option value="cliente">cliente</option>
      </select>
    </label>

    <br><br>

    <label>Senha: <input type="password" name="senha" value="123"></label>

    <br><br>

    <button type="submit">Entrar</button>

  </form>

  <p><small>Senha de todos: 123</small></p>

</body>
</html>
```

---

## 📄 Arquivo: `views/painel.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Painel</title>
</head>
<body>

  <h2>Painel — <span id="titulo-perfil"></span></h2>

  <!--
    data-perfis → lista os perfis que podem ver este bloco.
    O JavaScript lê esse atributo e esconde os não permitidos.
    Múltiplos perfis separados por vírgula: "admin,gerente"
  -->

  <div data-perfis="admin">
    <p>🔴 Você é <strong>admin</strong>. Você vê tudo.</p>
  </div>

  <div data-perfis="admin,gerente">
    <p>🟡 Você é <strong>admin ou gerente</strong>. Bloco compartilhado.</p>
  </div>

  <div data-perfis="cliente">
    <p>🟢 Você é <strong>cliente</strong>. Você vê apenas seus dados.</p>
  </div>

  <br>

  <form action="/logout" method="POST">
    <button type="submit">Sair</button>
  </form>

  <script>
    // Busca o perfil do usuário logado via GET /api/painel
    // Se a sessão expirou, o servidor redireciona para /login
    // e res.ok será false — tratamos redirecionando no frontend
    fetch('/api/painel')
      .then(res => {
        if (!res.ok) {
          window.location.href = '/login';
        }
        return res.json();
      })
      .then(dados => {

        document.getElementById('titulo-perfil').textContent =
          dados.usuario + ' (' + dados.perfil + ')';

        // Percorre todos os blocos com data-perfis
        // Exibe os que incluem o perfil atual, esconde os demais
        // ATENÇÃO: proteção visual apenas — barreira real é o backend
        document.querySelectorAll('[data-perfis]').forEach(bloco => {
          const permitidos = bloco.getAttribute('data-perfis').split(',');
          bloco.style.display = permitidos.includes(dados.perfil) ? 'block' : 'none';
        });

      });
  </script>

</body>
</html>
```

---

## ✅ Teste do Mini 5

```bash
node seed.js   # só na primeira vez
node server.js
```

Acesse `http://localhost:3000/login` (senha: 123):

| Perfil | Vê no painel |
|---|---|
| `admin` | Bloco vermelho + amarelo |
| `gerente` | Só amarelo |
| `cliente` | Só verde |

**Teste extra:** Acesse `/painel` sem login → deve redirecionar para `/login`.

**Perguntas para fixar:**

- Por que `validarSenha()` é `async`? (Resposta: `bcrypt.compare()` é assíncrono — o processo de comparação é lento por design para dificultar ataques de força bruta.)
- O que aconteceria se concatenássemos o usuário direto na query SQL? (Resposta: SQL Injection — o usuário poderia manipular a query e acessar ou destruir dados do banco.)

---

---

# MINI 3 — Upload de Imagens com Multer

> **Conceito:** Na Locadora, cada veículo tem uma foto. O fluxo é: o usuário escolhe uma imagem → o frontend envia para o backend → o Multer salva o arquivo na pasta `uploads/` → o Controller salva o caminho do arquivo no banco → o frontend exibe a imagem buscando o caminho do banco.
>
> Este mini replica exatamente esse fluxo com um exemplo simples: cadastro de itens com foto.

## 📂 Estrutura de pastas

```text
mini3-imagens/
├── .env                    ← Credenciais do banco
├── server.js               ← Ponto de entrada
├── config/
│   ├── db.js               ← Pool de conexões
│   └── upload.js           ← Configuração do Multer
├── routes/
│   └── api.js              ← Rotas de item
├── controllers/
│   └── ItemController.js   ← Recebe upload, salva no banco, lista
├── models/
│   └── Item.js             ← Queries ao banco
├── uploads/                ← Pasta onde as imagens são salvas
└── views/
    └── index.html          ← Formulário de upload + listagem
```

## 3.1 — Criar pastas, arquivos e instalar dependências

```bash
mkdir -p mini3-imagens/config mini3-imagens/routes mini3-imagens/controllers mini3-imagens/models mini3-imagens/uploads mini3-imagens/views
cd mini3-imagens
npm init -y
npm install express mysql2 dotenv multer

# Cria todos os arquivos em branco de uma vez
touch .env config/db.js config/upload.js routes/api.js controllers/ItemController.js models/Item.js views/index.html server.js
```

## 3.2 — Criar banco e tabela

```sql
-- Execute no MySQL Workbench ou terminal MySQL
USE mini_imagens;

CREATE TABLE IF NOT EXISTS itens (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  nome      VARCHAR(100) NOT NULL,
  foto      VARCHAR(255) NOT NULL
);
```

---

## 📄 Arquivo: `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Senai@118
DB_NAME=mini_imagens
PORT=3000
```

---

## 📄 Arquivo: `config/db.js`

```javascript
// Igual aos minis anteriores — pool de conexões com o banco
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

module.exports = pool.promise();
```

---

## 📄 Arquivo: `config/upload.js`

> **Papel:** Configura o Multer — define onde salvar, como nomear e quais tipos de arquivo aceitar.

```javascript
// ============================================================
// config/upload.js — CONFIGURAÇÃO DO MULTER
//
// Multer é um middleware para upload de arquivos.
// Ele intercepta requisições com Content-Type: multipart/form-data
// (o tipo usado quando um <form> envia arquivos).
//
// Sem Multer, req.body não consegue ler arquivos —
// só lê campos de texto.
//
// ── O que o Multer faz neste arquivo ─────────────────────────
//
// 1. diskStorage → define ONDE e COM QUE NOME salvar o arquivo
//
//    destination → pasta de destino (uploads/)
//    filename    → nome do arquivo salvo no servidor
//
//    Por que renomear o arquivo?
//    Se dois usuários enviarem "foto.jpg", um sobrescreve o outro.
//    Usamos Date.now() + número aleatório para garantir nome único.
//    Ex: 1714900000000_492103847.jpg
//
// 2. fileFilter → função que decide se aceita ou rejeita o arquivo
//    Aqui aceitamos apenas imagens (image/jpeg, image/png, etc.)
//    Se o usuário tentar enviar um .pdf ou .exe, rejeitamos.
//
// 3. limits → tamanho máximo do arquivo (5MB aqui)
//
// Este arquivo é idêntico ao config/upload.js da Locadora.
// ============================================================





// 14º Digitar o código (Feito pelo Professor - AQUI)






// ── ONDE E COMO SALVAR ────────────────────────────────────────


  // Define a pasta de destino
  // req  → dados da requisição
  // file → informações do arquivo enviado
  // cb   → callback: cb(erro, destino)



  // Define o nome do arquivo salvo
  // Combina timestamp + número aleatório para evitar colisões


    // path.extname extrai a extensão original: '.jpg', '.png', etc.



// ── FILTRO DE TIPO DE ARQUIVO ─────────────────────────────────
// Aceita apenas arquivos cujo mimetype começa com "image/"
// image/jpeg, image/png, image/webp → aceito
// application/pdf, text/html        → rejeitado



// ── INSTÂNCIA DO MULTER ───────────────────────────────────────



// Exporta para uso nos Controllers ou diretamente nas rotas



```

---

## 📄 Arquivo: `models/Item.js`

```javascript
// ============================================================
// models/Item.js — MODEL
//
// Dois métodos:
//   criar(nome, foto)  → INSERT com nome e caminho da imagem
//   listarTodos()      → SELECT de todos os itens
//
// O campo "foto" guarda o CAMINHO do arquivo no servidor,
// não o arquivo em si. Exemplo: "uploads/1714900000_492103.jpg"
// O frontend usa esse caminho como src da tag <img>.
//
// Nunca guarde imagens em base64 no banco — é lento e ocupa
// muito espaço. Guarde sempre o caminho, como fazemos aqui.
// ============================================================

const pool = require('../config/db');


class Item {

  // Insere um novo item com nome e caminho da foto
  static async criar(nome, foto) {
    const [resultado] = await pool.query(
      'INSERT INTO itens (nome, foto) VALUES (?, ?)',
      [nome, foto]
    );

    // resultado.insertId → ID gerado pelo AUTO_INCREMENT
    return resultado.insertId;
  }


  // Retorna todos os itens cadastrados
  static async listarTodos() {
    const [rows] = await pool.query('SELECT * FROM itens');
    return rows;
  }

}

module.exports = Item;
```

---

## 📄 Arquivo: `controllers/ItemController.js`

```javascript
// ============================================================
// controllers/ItemController.js — CONTROLLER
//
// Dois métodos:
//   cadastrar → recebe nome + arquivo, salva no banco
//   listar    → retorna todos os itens com caminho da imagem
//
// ── O que o Multer entrega ao Controller ─────────────────────
//
// Quando o Multer processa o upload antes do Controller,
// ele adiciona à requisição:
//
//   req.file → objeto com dados do arquivo salvo:
//     {
//       fieldname:    'foto',          ← nome do campo no form
//       originalname: 'minha-foto.jpg',← nome original do usuário
//       filename:     '1714900_49.jpg',← nome salvo no servidor
//       path:         'uploads/1714900_49.jpg', ← caminho completo
//       size:         48291            ← tamanho em bytes
//     }
//
//   req.body → campos de texto do formulário (nome, etc.)
//
// Se nenhum arquivo foi enviado, req.file será undefined.
// ============================================================

const Item = require('../models/Item');


class ItemController {

  // ── cadastrar(req, res) ───────────────────────────────────
  // Chamado por: POST /api/itens
  // O Multer já processou o arquivo antes de chegar aqui
  // ─────────────────────────────────────────────────────────
  static async cadastrar(req, res) {
    try {

      // req.body.nome  → campo de texto do formulário
      // req.file       → arquivo processado pelo Multer
      const { nome } = req.body;

      if (!req.file) {
        return res.status(400).json({ erro: 'Nenhuma imagem enviada.' });
      }

      // req.file.path → caminho onde o Multer salvou o arquivo
      // Ex: "uploads/1714900000000_492103847.jpg"
      // É esse caminho que guardamos no banco — não o arquivo em si
      const foto = req.file.path;

      const id = await Item.criar(nome, foto);

      res.status(201).json({ id, nome, foto });

    } catch (erro) {
      console.error('Erro ao cadastrar item:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }


  // ── listar(req, res) ──────────────────────────────────────
  // Chamado por: GET /api/itens
  // Retorna todos os itens com o caminho da imagem
  // ─────────────────────────────────────────────────────────
  static async listar(req, res) {
    try {
      const itens = await Item.listarTodos();
      res.json(itens);
    } catch (erro) {
      console.error('Erro ao listar itens:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }

}

module.exports = ItemController;
```

---

## 📄 Arquivo: `routes/api.js`

```javascript
// ============================================================
// routes/api.js — ROTAS
//
// POST /api/itens → upload.single('foto') roda antes do Controller
//
// upload.single('foto') é um middleware do Multer:
//   - Intercepta a requisição multipart
//   - Salva o arquivo em uploads/
//   - Popula req.file com os dados do arquivo
//   - Passa para ItemController.cadastrar via next()
//
// 'foto' deve bater com o atributo name do <input type="file">
// no HTML: <input type="file" name="foto">
// ============================================================

const express        = require('express');
const router         = express.Router();
const upload         = require('../config/upload');
const ItemController = require('../controllers/ItemController');

// POST /api/itens → Multer processa o arquivo, depois o Controller salva
router.post('/itens', upload.single('foto'), ItemController.cadastrar);

// GET /api/itens → lista todos os itens
router.get('/itens', ItemController.listar);

module.exports = router;
```

---

## 📄 Arquivo: `server.js`

```javascript
// ============================================================
// server.js — PONTO DE ENTRADA
//
// Diferença em relação aos minis anteriores:
//   app.use('/uploads', express.static('uploads'))
//
// Esta linha serve a pasta uploads/ como arquivos estáticos.
// Sem ela, o browser não consegue acessar as imagens pelo caminho.
//
// Com ela, uma imagem salva em uploads/foto.jpg fica acessível
// via http://localhost:3000/uploads/foto.jpg — que é exatamente
// o src que colocamos na tag <img> no frontend.
// ============================================================

require('dotenv').config();

const express   = require('express');
const path      = require('path');
const apiRoutes = require('./routes/api');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve a pasta views/ (o HTML do frontend)
app.use(express.static(path.join(__dirname, 'views')));

// ── PONTO-CHAVE ───────────────────────────────────────────────
// Serve a pasta uploads/ para que o browser acesse as imagens.
// Sem isso: <img src="uploads/foto.jpg"> retorna 404.
// Com isso:  <img src="uploads/foto.jpg"> carrega a imagem.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mini 3 — Imagens rodando em http://localhost:${PORT}`);
});
```

---

## 📄 Arquivo: `views/index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Mini 3 — Imagens</title>
</head>
<body>

  <h2>Cadastrar Item com Foto</h2>

  <!--
    enctype="multipart/form-data" é OBRIGATÓRIO para upload de arquivos.
    Sem ele, o arquivo não é enviado — só o nome de texto.
    O Multer só consegue processar requisições com este enctype.
  -->
  <form id="form-cadastro" enctype="multipart/form-data">

    <label>Nome: <input type="text" name="nome" required></label>
    <br><br>

    <!--
      name="foto" deve bater com upload.single('foto') em routes/api.js
      O Multer usa esse name para identificar qual campo é o arquivo
    -->
    <label>Foto: <input type="file" name="foto" accept="image/*" required></label>
    <br><br>

    <button type="submit">Cadastrar</button>

  </form>

  <hr>

  <h2>Itens Cadastrados</h2>
  <div id="lista"></div>

  <script>

    // ── CADASTRAR ─────────────────────────────────────────────
    // Para enviar arquivos via fetch, usamos FormData.
    // FormData serializa automaticamente o form incluindo o arquivo.
    //
    // NÃO use JSON.stringify com arquivos — JSON não suporta binários.
    // FormData com fetch é o equivalente ao <form enctype="multipart">
    // mas feito via JavaScript, sem recarregar a página.
    // ─────────────────────────────────────────────────────────
    document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
      e.preventDefault();

      // FormData captura todos os campos do form, incluindo o arquivo
      const formData = new FormData(e.target);

      const res = await fetch('/api/itens', {
        method: 'POST',
        body: formData
        // NÃO defina Content-Type aqui — o browser define automaticamente
        // o boundary correto do multipart. Definir manualmente quebra o upload.
      });

      if (res.ok) {
        e.target.reset();   // Limpa o formulário
        carregarItens();    // Recarrega a lista
      } else {
        alert('Erro ao cadastrar item.');
      }
    });


    // ── LISTAR ────────────────────────────────────────────────
    // Busca todos os itens e renderiza nome + imagem.
    //
    // item.foto → caminho salvo no banco: "uploads/1714900_49.jpg"
    // <img src="uploads/1714900_49.jpg"> funciona porque o server.js
    // serve a pasta uploads/ como estática em /uploads
    // ─────────────────────────────────────────────────────────
    async function carregarItens() {
      const res   = await fetch('/api/itens');
      const itens = await res.json();

      document.getElementById('lista').innerHTML = itens.map(item => `
        <div>
          <p><strong>${item.nome}</strong></p>
          <img src="${item.foto}" width="150">
          <hr>
        </div>
      `).join('');
    }

    carregarItens();

  </script>

</body>
</html>
```

---

## ✅ Teste do Mini 6

```bash
node server.js
```

Acesse `http://localhost:3000`, cadastre um item com foto e verifique:

**Teste 1 — Upload:** A imagem aparece na lista logo após o cadastro.

**Teste 2 — Banco:** No MySQL Workbench, `SELECT * FROM itens` deve mostrar o nome e o caminho da imagem (ex: `uploads/1714900000_492103847.jpg`).

**Teste 3 — Arquivo:** A pasta `uploads/` deve conter o arquivo com o nome gerado.

**Teste 4 — Rejeição:** Tente enviar um arquivo `.pdf` — deve ser rejeitado pelo filtro do Multer.

**Diagrama do fluxo:**

```
Usuário escolhe nome + foto e clica Cadastrar
        ↓
index.html → fetch POST /api/itens (FormData com o arquivo)
        ↓
server.js → routes/api.js
        ↓
upload.single('foto') [Multer]
  → salva arquivo em uploads/1714900_49.jpg
  → popula req.file com o caminho
        ↓
ItemController.cadastrar()
  → lê req.body.nome e req.file.path
  → Item.criar(nome, 'uploads/1714900_49.jpg')
        ↓
INSERT INTO itens (nome, foto) VALUES (?, ?)
        ↓
res.json({ id, nome, foto })
        ↓
index.html recarrega lista → <img src="uploads/1714900_49.jpg">
        ↓
server.js serve o arquivo via /uploads estático
        ↓
Imagem aparece na tela
```

<br>
<div>
    <img src="./diag-fluxo-06-mvc.png" width="400">
</div>
<br>

**Perguntas para fixar:**

- Por que o `<form>` precisa do atributo `enctype="multipart/form-data"`? (Resposta: sem ele o arquivo não é enviado na requisição — só campos de texto são transmitidos.)
- Por que não guardamos a imagem em si no banco, só o caminho? (Resposta: guardar binários no banco é muito mais lento e ocupa espaço desnecessário. O banco guarda o endereço, o sistema de arquivos guarda o conteúdo.)
- Para que serve a linha `app.use('/uploads', express.static(...))` no `server.js`? (Resposta: sem ela o browser não consegue acessar as imagens pelo caminho — o Express não serve arquivos de pastas que não foram explicitamente expostas.)

---

# 🗺️ Como os Minis se conectam ao Projeto Real

```
Mini 4 (MVC + Banco)
  └→ config/db.js              → idêntico na Locadora
     models/Veiculo.js         → mesma estrutura de queries async/await
     controllers/VeiculoController.js → mesmo padrão try/catch
     routes/api.js             → mesma lógica de mapeamento

Mini 5 (Perfis + Banco + bcrypt)
  └→ models/Usuario.js         → buscarPorUsuario + validarSenha com bcrypt
     middleware/auth.js        → verificarSessao idêntico
     controllers/AuthController.js → login/logout idênticos
     .env + SESSION_SECRET     → mesmo padrão de configuração

Mini 6 (Imagens + Multer)
  └→ config/upload.js          → idêntico na Locadora
     controllers/VeiculoController.js → req.file.path salvo no banco
     server.js (/uploads)      → mesma linha de static para servir imagens
     views (FormData + fetch)  → mesmo padrão de envio no frontend
```

---

# 📋 Checklist antes de partir para o projeto

- [ ] **Mini 4:** Por que os métodos do Model são `async` e o Controller usa `await`?
- [ ] **Mini 4:** O que é um prepared statement e por que usamos `?` nas queries?
- [ ] **Mini 4:** Para que serve o arquivo `.env` e por que ele não vai para o Git?
- [ ] **Mini 5:** Por que `bcrypt.compare()` é assíncrono?
- [ ] **Mini 5:** O que `req.session.destroy()` faz e onde a sessão é armazenada?
- [ ] **Mini 5:** Qual arquivo decide quais rotas são protegidas e qual middleware as protege?
- [ ] **Mini 6:** Por que o `<form>` precisa de `enctype="multipart/form-data"`?
- [ ] **Mini 6:** O que o Multer adiciona à requisição antes de chegar ao Controller?
- [ ] **Mini 6:** Por que guardamos o caminho da imagem no banco, não o arquivo em si?

Se conseguir responder todas, os conceitos estão internalizados. Pode avançar para a Locadora. 🚀
