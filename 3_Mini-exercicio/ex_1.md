# 🍕 Exercício Prático de POO  
# Mini Projeto: Sistema de Pedidos

## 🎯 Objetivo
Crie um pequeno sistema utilizando os pilares da Programação Orientada a Objetos:

- Abstração
- Encapsulamento
- Herança
- Polimorfismo

---

# 🧩 Requisitos

## 1 e 2 Abstração e encapsulamento
Crie uma classe base chamada `Pedido`.

Ela deverá possuir:

- atributo privado `cliente` Obs: Crie um (Getter) para o acesso ao nome do cliente.
- método `mostrarPedido()` com return "Pedido enviado!"

A ideia da abstração é criar um modelo genérico de pedido que será utilizado pelas classes filhas.

---

## 3. Herança
Crie duas classes que herdam de `Pedido`:

### 🍔 PedidoLanche

### 🍕 PedidoPizza

---

## 4. Polimorfismo
Nas duas classes filhas:

- sobrescreva o método `mostrarPedido()`

Cada classe deverá exibir uma mensagem diferente.

Exemplo:

```txt
Pedido de lanche enviado!
Pedido de pizza enviado!
```

---

## 5. Função Polimórfica
Crie a função:

```js
exibirPedido(pedido)
```

Ela deverá funcionar tanto para:

- `PedidoLanche`
- `PedidoPizza`

---

# 🚀 Desafio Extra

Mostre o resultado diretamente no navegador usando:

```js
document.body.innerHTML
```
# 🎯 Exemplo da Saída esperada

![Texto alternativo](saída.png)
