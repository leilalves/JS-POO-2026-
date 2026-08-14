const express        = require('express');
const router         = express.Router();
const upload         = require('../config/upload');
const ItemController = require('../controllers/ItemController');

// POST /api/itens → Multer processa o arquivo, depois o Controller salva
router.post('/itens', upload.single('foto'), ItemController.cadastrar);

// GET /api/itens → lista todos os itens
router.get('/itens', ItemController.listar);

module.exports = router;