// ============================================================
// controllers/ItemController.js — CONTROLLER
//
// Dois métodos:
//   cadastrar → recebe nome + arquivo, salva no banco
//   listar    → retorna todos os itens com caminho da imagem
//
// ── O que o Multer entrega ao Controller ─────────────────────
//
// Quando o Multer processa o upload antes do Controller,
// ele adiciona à requisição:
//
//   req.file → objeto com dados do arquivo salvo:
//     {
//       fieldname:    'foto',          ← nome do campo no form
//       originalname: 'minha-foto.jpg',← nome original do usuário
//       filename:     '1714900_49.jpg',← nome salvo no servidor
//       path:         'uploads/1714900_49.jpg', ← caminho completo
//       size:         48291            ← tamanho em bytes
//     }
//
//   req.body → campos de texto do formulário (nome, etc.)
//
// Se nenhum arquivo foi enviado, req.file será undefined.
// ============================================================

const Item = require('../models/Item');


class ItemController {

  // ── cadastrar(req, res) ───────────────────────────────────
  // Chamado por: POST /api/itens
  // O Multer já processou o arquivo antes de chegar aqui
  // ─────────────────────────────────────────────────────────
  static async cadastrar(req, res) {
    try {

      // req.body.nome  → campo de texto do formulário
      // req.file       → arquivo processado pelo Multer
      const { nome } = req.body;

      if (!req.file) {
        return res.status(400).json({ erro: 'Nenhuma imagem enviada.' });
      }

      // req.file.path → caminho onde o Multer salvou o arquivo
      // Ex: "uploads/1714900000000_492103847.jpg"
      // É esse caminho que guardamos no banco — não o arquivo em si
      const foto = req.file.path;

      const id = await Item.criar(nome, foto);

      res.status(201).json({ id, nome, foto });

    } catch (erro) {
      console.error('Erro ao cadastrar item:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }


  // ── listar(req, res) ──────────────────────────────────────
  // Chamado por: GET /api/itens
  // Retorna todos os itens com o caminho da imagem
  // ─────────────────────────────────────────────────────────
  static async listar(req, res) {
    try {
      const itens = await Item.listarTodos();
      res.json(itens);
    } catch (erro) {
      console.error('Erro ao listar itens:', erro);
      res.status(500).json({ erro: 'Erro interno do servidor.' });
    }
  }

}

module.exports = ItemController;