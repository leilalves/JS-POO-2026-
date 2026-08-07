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