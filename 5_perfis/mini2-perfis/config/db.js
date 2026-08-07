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