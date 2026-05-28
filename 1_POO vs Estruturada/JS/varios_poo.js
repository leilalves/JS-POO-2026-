// ==========================================
// PROGRAMAÇÃO ORIENTADA A OBJETOS EM JS
// ==========================================

class Cachorro {
    // Constructor: recebe os dados do objeto
    constructor(nome, comida, sono) {
        this.nome = nome;
        this.comida = comida;
        this.sono = sono;
    }

    // Diminui 1 unidade de comida
    comer() {
        if (this.comida > 0) {
            this.comida--;
        }
    }

    // Getters
    getNome() {
        return this.nome;
    }

    getComida() {
        return this.comida;
    }

    getSono() {
        return this.sono;
    }
}

// CRIANDO OBJETOS
const cachorros = [
    new Cachorro("Cléo", 247, true),
    new Cachorro("Francisco", 5, true),
    new Cachorro("Conan", 19, false),
    new Cachorro("Leleco", 3, false),
    new Cachorro("Babi", 13, true)
];

// USANDO MÉTODOS
cachorros.forEach(cachorro => {
    cachorro.comer();
});

// MONTANDO HTML
let resultado = "";
cachorros.forEach(cachorro => {
    resultado += `
        <p><strong>${cachorro.getNome()}</strong></p>
        <ul>
            <li>
                Comida:
                <strong>${cachorro.getComida()}</strong>
            </li>

            <li>
                Sono:
                <strong>${cachorro.getSono() ? "Sim" : "Não"}</strong>
            </li>
        </ul>
    `;
});

// EXIBINDO NO NAVEGADOR
document.body.innerHTML = `
    <h1>Resultados dos Cachorros (POO)</h1>
    ${resultado}
`;