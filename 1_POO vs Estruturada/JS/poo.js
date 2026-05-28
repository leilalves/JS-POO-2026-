// ==========================================
// PARTE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS EM JS
// ==========================================



// Digitar o código (Feito pelo Professor - AQUI)




// ==========================================
// EXIBINDO RESULTADOS NO NAVEGADOR
// ==========================================
// document.body.innerHTML altera o conteúdo
// HTML da página.
// ==========================================

// Fazer o teste trocando abaixo:

// Maneira correta de acessar a Classe encapsulada
// <strong>${cachorro1.getNome()}</strong>

//cachorro1.#nome -> ERRO (Olhar erro no Console)
// <strong>${cachorro1.#nome()}</strong>

document.body.innerHTML = `
    <h1>Resultados dos Cachorros (POO)</h1>

    <p>
        <strong>${cachorro1.getNome()}</strong>

        agora tem
        <strong>${cachorro1.getComida()}</strong>
        unidades de comida.
    </p>

    <p>
        <strong>${cachorro2.getNome()}</strong>
        está com sono?
        <strong>${cachorro2.getSono() ? "Sim" : "Não"}</strong>
    </p>
`;