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