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
const pool = require('../config/db');

class item {
    // ── buscarTodos() ─────────────────────────────────────────
    // Retorna todos os itens da tabela.
    // Equivalente a: SELECT * FROM itens
    // ─────────────────────────────────────────────────────────
    static async buscarTodos() {
        const[rows] = await pool.query('SELECT * FROM itens')
        return rows;
    }

    // ── buscarPorNome(termo) ──────────────────────────────────
    // Filtra itens pelo nome usando LIKE.
    // O % antes e depois do termo significa "qualquer coisa
    // antes e depois" — busca parcial, não exata.
    //
    // Equivalente a: SELECT * FROM itens WHERE nome LIKE '%termo%'
    // ─────────────────────────────────────────────────────────
    static async buscarPorNome(termo) {
        const [rows] = await pool.query('SELECT * FROM itens WHERE nome LIKE ? ' ,
            [`%${termo}`] );
            return rows;
    }

}

module.exports = item;






 















// 3º Digitar o código (Feito pelo Professor - AQUI)




    // O ? é substituído pelo valor do array de forma segura






// 4º Digitar o código (Feito pelo Professor - AQUI)