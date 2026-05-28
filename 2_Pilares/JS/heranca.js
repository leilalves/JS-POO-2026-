// Classe Pai
class Animal {
    constructor(nome) {
        this.nome = nome
    }

    // Método dormir (Classe pai)
    // Será herdado por todos os filhos) Objetos 
    dormir() {
        return `${this.nome} está dormindo.`
    }
}

// Classe Cavalo
class Cavalo extends Animal {
    // Método exclusivo da Classe cavalo
    relinchar() {
        return `${this.nome} fez: Iiiirrrrrí.`
    }
}

// Classe Passaro
class Passaro extends Animal {
    // Método exclusivo da Classe Pássaro
    cantar() {
        return `${this.nome} fez: Piu piu!`
    }
}

// Criando instâncias ou objetos
const cavalo = new Cavalo('Pé de pano')
const passaro = new Passaro('Piu')

// Exibindo
document.body.innerHTML = `
    <h1>Herança</1><br>

    <h2>Cavalo</2>
    <!-- Método herdado -->
    <p>${cavalo.dormir()}</p>
    <!-- Método próprio -->
    <p>${cavalo.relinchar()}</p>
    <p>_______________________</p>

    <h2>Pássaro</2>
    <!-- Método herdado -->
    <p>${passaro.dormir()}</p>
    <!-- Método próprio -->
    <p>${passaro.cantar()}</p>

`
