// ============================================================
// routes/api.js — ROTAS
//
// Conecta URLs aos Controllers.
// Não contém lógica — só a ligação: URL → Controller.
// ============================================================

const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');

// GET /api/itens        → lista todos
// GET /api/itens?busca= → filtra por nome
router.get('/itens', ItemController.listar);

module.exports = router;


