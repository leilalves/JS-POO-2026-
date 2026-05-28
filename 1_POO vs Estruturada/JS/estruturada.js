// ==========================================
// PARTE 1: PROGRAMAÇÃO ESTRUTURADA EM JS
// ==========================================

let nomeCachorro1 = "Nelson"
let comidaCachorro1 = 3 // argumento (valor enviado para a função)
let sonoCachorro1 = false

let nomeCachorro2 = "Jeremias"
let comidaCachorro2 = 1 // argumento (valor enviado para a função)
let sonoCachorro2 = true

// Parâmetro: Informação que a função precisa para funcionar
function comer(quantidadeComida){
    return quantidadeComida -1
}

// Esta função não precisa de nenhum parâmetro para funcionar
function dormir() {
    return true
}

// Usando as funções criadas
comidaCachorro1 = comer(comidaCachorro1)
sonoCachorro2 = dormir()

// Exibindo os resultados no navegador
document.body.innerHTML = `
    <h1>Resultados dos Cachorros</h1>
    <p><strong>${nomeCachorro1}</strong> agora tem <strong>${comidaCachorro1}</strong> unidades de comida.</p>
    <p><strong>${nomeCachorro2}</strong> está com sono? <strong>${sonoCachorro2 ? "Sim" : "Não"}</strong></p>
`;
