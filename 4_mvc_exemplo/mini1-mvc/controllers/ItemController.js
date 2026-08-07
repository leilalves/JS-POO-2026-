// ============================================================
// controllers/ItemController.js — CONTROLLER
//
// O Controller agora é async porque precisa aguardar
// a resposta do banco antes de responder ao cliente.
//
// try/catch substitui o if(erro) dos callbacks:
//   try   → tudo correu bem, responde com os dados
//   catch → algo deu errado (banco fora, query errada...),
//           responde com erro 500
//
// O Controller NÃO sabe como a query é feita — isso é do Model.
// O Controller NÃO sabe como o HTML é montado — isso é da View.
// ============================================================

const Item = require('../models/Item');

class ItemController {
  // ── listar(req, res) ──────────────────────────────────────
  // Chamado por: GET /api/itens?busca=termo
  // ─────────────────────────────────────────────────────────
    static async listar(req, res){
        try {
            // Pega o valor de "busca" da URL (?busca=...); se não vier nenhum, fica vazio.
            const termo = req.query.busca || '';

            // await pausa aqui até o banco responder
            const itens = termo
                ? await Item.buscarPorNome(termo)
                : await Item.buscarTodos();
            res.json(itens);
            
        } catch (erro) {
            // Qualquer erro do banco cai aqui
            // Em produção: logar o erro, não expor detalhes ao cliente
            console.error('Erro de buscar itens', erro);
            res.status(500).json({ erro: 'Erro interno do servidor'});
        }
    }

}

module.exports = ItemController;