// ============================================================
// middleware/auth.js — MIDDLEWARE DE AUTENTICAÇÃO
//
// Função que roda ANTES do Controller em rotas protegidas.
// Se não houver sessão ativa → redireciona para /login.
// Se houver sessão → next() passa para o Controller.
//
// Assinatura padrão de middleware Express: (req, res, next)
//   req  → dados da requisição (inclui req.session)
//   res  → objeto para enviar resposta
//   next → passa o controle para o próximo passo
//
// Uso em routes/api.js:
//   router.get('/painel', verificarSessao, PainelController.dados)
//                          ↑ roda primeiro    ↑ só roda se passar
// ============================================================
function verificarSessao(req, res, next){
    // req.session.usuario só existe após AuthController.login()
    // ter salvo os dados — se não existe, não há sessão ativa
    if(!req.session.usuario) {
        return res.redirect('/login');
    }

    // Sessão válida -> passa para o Controller
    next();
}

module.exports = {verificarSessao};



