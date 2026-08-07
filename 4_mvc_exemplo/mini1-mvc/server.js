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
require('dotenv').config();

const express = require('express');
const path = require('path');
const apiRoutes = require('./routes/api');
const app = express();

// ── MIDDLEWARES GLOBAIS ───────────────────────────────────────

// Lê body em formato JSON (fetch com JSON.stringify)
app.use(express.json());

// Lê body de formulários HTML (<form method="POST">)
app.use(express.urlencoded({extended: true}));

// Serve a pasta views/ como arquivos estáticos
// views/index.html fica acessível em http://localhost:3000
app.use(express.static(path.join(__dirname, 'views')));

// ── ROTAS ────────────────────────────────────────────────────
// Todas as rotas da API ficam sob o prefixo /api
app.use('/api', apiRoutes);


// ── SERVIDOR ─────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Mini 4 - MVC rodando em: http://localhost:${PORT}`);
});
