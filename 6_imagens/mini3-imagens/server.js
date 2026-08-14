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