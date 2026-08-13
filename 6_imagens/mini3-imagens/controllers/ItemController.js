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