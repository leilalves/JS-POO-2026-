class Animal {
    // ABSTRAÇÃO (Cria métodos genéricos, deixando que as 
    // classes filhas definam como esses métodos funcionarão.)

    // Uma classe abstrata é uma classe que serve como modelo/base para outras classes.
    // Ela normalmente:
    // * define características comuns
    // * NÃO deve ser usada diretamente
    // * obriga as classes filhas a seguirem certas regras

    fazerSom() {
        throw new Error("Método obrigatório.");
        // No Java/C# existe (abstract class),em JS não existe o comando abstract
        // Então simulamos classes abstratas criando métodos que 
        // geram erro quando não são implementados.
    }
    mover() {
        throw new Error("Método obrigatório.");
    }
}

// Classe filha
class Cachorro extends Animal {
    // Implementação do método fazerSom()
    fazerSom() {
        return "Au au!";
    }
    // Implementação do método mover()
    mover() {
        return "Andando com 4 patas";
    }
}

class Passaro extends Animal {
    fazerSom() {
        return "Piu piu!";
    }

    mover() {
        return "Voando";
    }
}

// Criando objeto
const rex = new Cachorro();
const azulao = new Passaro();

// Exibindo no navegador
document.body.innerHTML = `
    <h1>Abstração</h1>
    <p>
        A classe Animal criou métodos genéricos,
        mas a classe Cachorro definiu como eles
        funcionam.
    </p>

    <h2>Cachorro</h2>
    <p>Som: ${rex.fazerSom()}</p>
    <p>Movimento: ${rex.mover()}</p>

    <h2>Pássaro</h2>
    <p>Som: ${azulao.fazerSom()}</p>
    <p>Movimento: ${azulao.mover()}</p>
`;