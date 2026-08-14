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