// ==========================================
// PARTE 2: PROGRAMAÇÃO ORIENTADA A OBJETOS EM JS
// ==========================================

class Cachorro {
    // # Atributos privados (Encapsulado)
    // ou seja não permite acesso direto
    #nome
    #comida
    #sono

    // Método Construtor (Executado automaticamente)
    // quando criamos um objeto
    // Ele recebe valores iniciais e salva
    // dentro dos atributos (Prepara para objeto)
    // this é como dizer "Meu próprio atributo"

    constructor(nome, comida, sono) {
        this.#nome = nome
        this.#comida = comida
        this.#sono = sono
    }

    // Método comer
    comer() {
        this.#comida -= 1
    }

    // Método dormir
    dormir() {
        this.#sono = false
    }

    // Getters para poder acessar
    getNome(){
        return this.#nome
    }
    getComida(){
        return this.#comida
    }
    getSono(){
        return this.#sono
    }

}

// Criando instâncias ou objetos
const cachorro1 = new Cachorro("Bob", 5, false)
const cachorro2 = new Cachorro("Snoop", 8, true)

// Usando métodos
cachorro1.comer()
cachorro2.dormir()

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