// ============================================================
// controllers/AuthController.js — CONTROLLER DE AUTENTICAÇÃO
//
// Gerencia login e logout.
// Fluxo do login:
//   1. Lê usuário e senha do req.body
//   2. Busca o usuário no banco via Model
//   3. Compara a senha com o hash via Model (bcrypt)
//   4. Se válido: salva perfil na sessão e redireciona
//   5. Se inválido: devolve mensagem de erro
//
// async/await aqui porque buscarPorUsuario() e validarSenha()
// são operações assíncronas (banco + bcrypt).
// ============================================================
const Usuario = require('../models/Usuario');


class AuthController {
    static async login (req, res) {
        try {
            const {usuario, senha} = req.body;
            // Busca o usuário no banco
            const dados = await Usuario.buscarPorUsuario(usuario);

            // Mesma mensagem para "usuário não existe" e "senha errada"
            // Não revelar qual dos dois falhou é boa prática de segurança
            if (!dados || !(await Usuario.validarSenha(senha, dados.senha))) {
                return res.send('<p>Usuário ou senha inválidos! <a href="/login">Tentar novamente</a></p>');
            }
            // ── CRIANDO A SESSÃO ──────────────────────────────────
            // req.session persiste entre requisições enquanto a
            // sessão estiver ativa (cookie válido no navegador).
            // O campo "perfil" é usado pelo middleware e pelo
            // PainelController para controlar o acesso.
            // ─────────────────────────────────────────────────────
            req.session.usuario = dados.usuario;
            req.session.perfil = dados.perfil;

            res.redirect('/painel');

        } catch (erro) {
            console.error('Erro de login:', erro);
            res.status(500).send('Erro interno no servidor.');
        }
    }

    static logout(req, res) {
        // Destrói a sessão no servidor — cookie do navegador fica inválido
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
}

module.exports = AuthController;
