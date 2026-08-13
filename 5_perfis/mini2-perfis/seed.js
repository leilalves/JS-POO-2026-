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