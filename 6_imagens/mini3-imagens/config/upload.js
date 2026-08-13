// ============================================================
// config/upload.js — CONFIGURAÇÃO DO MULTER
//
// Multer é um middleware para upload de arquivos.
// Ele intercepta requisições com Content-Type: multipart/form-data
// (o tipo usado quando um <form> envia arquivos).
//
// Sem Multer, req.body não consegue ler arquivos —
// só lê campos de texto.
//
// ── O que o Multer faz neste arquivo ─────────────────────────
//
// 1. diskStorage → define ONDE e COM QUE NOME salvar o arquivo
//
//    destination → pasta de destino (uploads/)
//    filename    → nome do arquivo salvo no servidor
//
//    Por que renomear o arquivo?
//    Se dois usuários enviarem "foto.jpg", um sobrescreve o outro.
//    Usamos Date.now() + número aleatório para garantir nome único.
//    Ex: 1714900000000_492103847.jpg
//
// 2. fileFilter → função que decide se aceita ou rejeita o arquivo
//    Aqui aceitamos apenas imagens (image/jpeg, image/png, etc.)
//    Se o usuário tentar enviar um .pdf ou .exe, rejeitamos.
//
// 3. limits → tamanho máximo do arquivo (5MB aqui)
//
// Este arquivo é idêntico ao config/upload.js da Locadora.
// ============================================================

const multer = require('multer');
const path = require('path');

// ── ONDE E COMO SALVAR ────────────────────────────────────────
const storage = multer.diskStorage({
    // Define a pasta de destino
    // req  → dados da requisição
    // file → informações do arquivo enviado
    // cb   → callback: cb(erro, destino)
    
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    // Define o nome do arquivo salvo
    // Combina timestamp + número aleatório para evitar colisões
    filename: (req, file, cb) => {

    // path.extname extrai a extensão original: '.jpg', '.png', etc.
    const extensao = path.extname(file.originalname);
    const nomeUnico = Date.Now() + '_' + Math.round(Math.random() * 1e9) + extensao;

    cb(null, nomeUnico);
    }

});

// ── FILTRO DE TIPO DE ARQUIVO ─────────────────────────────────
// Aceita apenas arquivos cujo mimetype começa com "image/"
// image/jpeg, image/png, image/webp → aceito
// application/pdf, text/html        → rejeitado

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image/')){
        cb(null, true); // aceita
    } else {
        cb(new Error("Apenas imagens são permitidas."), false); // Rejeita
    }
};

// ── INSTÂNCIA DO MULTER ───────────────────────────────────────
const upload = multer ({
    storage,
    fileFilter,
    limits: {fileSize: 5 * 1024 * 1024} // 5MB (Tamanho máximo)
});


// Exporta para uso nos Controllers ou diretamente nas rotas
module.exports = upload;