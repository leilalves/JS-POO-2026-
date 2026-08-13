const express             = require('express');
const router              = express.Router();
const path                = require('path');
const verificarSessao     = require('../middleware/auth'); 
const AuthController      = require('../controllers/AuthController');
const PainelController    = require('../controllers/PainelController');

// ── ROTAS PÚBLICAS ────────────────────────────────────────────

// Exibe o formulário de login
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});

// Processa as credenciais e cria a sessão
router.post('/login', AuthController.login);


// ── ROTAS PROTEGIDAS ─────────────────────────────────────────
// verificarSessao barra quem não está logado antes de chegar
// ao Controller

// Serve o HTML do painel
router.get('/painel', verificarSessao, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/painel.html'));
});

// API que o painel.html chama via fetch para saber o perfil
router.get('/api/painel', verificarSessao, PainelController.dados);

// Destrói a sessão
router.post('/logout', AuthController.logout);


module.exports = router;