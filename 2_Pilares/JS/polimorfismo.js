// Classe Pai
class Animal {
    // Método da classe pai
    fazerSom() {
        return "Som genérico"
    }
}

// Classes filhas
class Cachorro extends Animal {
    // Polimorfismo (Mesmo método, mas 
    // com comportamentos diferentes em
    // cada objeto)
    fazerSom() {
        return "Au au!" // Polimorfismo ocorre aqui
    }
}

class Gato extends Animal {
    fazerSom() {
        return "Miau!" // Polimorfismo ocorre aqui
    }
}

// Função Polimórfica (Trabalha com diferentes objetos)
// O importante é possuir o método fazerSom(). )
function comunicarAnimal(animal) {
    return animal.fazerSom()
}

// Criando objetos
const felix = new Cachorro()
const brutus = new Gato()

// Exibindo
document.body.innerHTML = `
    <h1>Polimorfismo</1>
    <h2>Som do felix: </h2>
    <p>${comunicarAnimal(felix)}</p>
    <p>_________________________</p>

    <h2>Som do brutus: </h2>
    <p>${comunicarAnimal(brutus)}</p>
`