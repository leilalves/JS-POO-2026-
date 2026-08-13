// controllers/PainelController.js — CONTROLLER DO PAINEL
//
// Devolve os dados do usuário logado ao frontend.
// Só chega aqui se verificarSessao() deixou passar.
//
// req.session.perfil → 'admin' | 'gerente' | 'cliente'
// O frontend usa esse valor para exibir os blocos corretos.
//
// A proteção real está no backend (middleware + controller).
// O frontend aplica visibilidade — mas não é a barreira real.
// ============================================================

class PainelController {

  static dados(req, res) {
    const { usuario, perfil } = req.session;
    res.json({ usuario, perfil });
  }

}

module.exports = PainelController;