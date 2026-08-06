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