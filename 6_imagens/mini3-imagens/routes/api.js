// ============================================================
// routes/api.js — ROTAS
//
// POST /api/itens → upload.single('foto') roda antes do Controller
//
// upload.single('foto') é um middleware do Multer:
//   - Intercepta a requisição multipart
//   - Salva o arquivo em uploads/
//   - Popula req.file com os dados do arquivo
//   - Passa para ItemController.cadastrar via next()
//
// 'foto' deve bater com o atributo name do <input type="file">
// no HTML: <input type="file" name="foto">
// ============================================================

const express        = require('express');
const router         = express.Router();
const upload         = require('../config/upload');
const ItemController = require('../controllers/ItemController');

// POST /api/itens → Multer processa o arquivo, depois o Controller salva
router.post('/itens', upload.single('foto'), ItemController.cadastrar);

// GET /api/itens → lista todos os itens
router.get('/itens', ItemController.listar);

module.exports = router;