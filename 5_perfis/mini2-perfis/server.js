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