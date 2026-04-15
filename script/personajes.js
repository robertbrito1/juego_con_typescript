export let nombre = [
    'Raul', 'Ana', 'Luis', 'Maria', 'Carlos', 'Sofia',
    'Javier', 'Laura', 'Pedro', 'Lucia', 'Andres', 'Elena', 'Marta', 'Diego', 'Carla', 'Fernando', 'Isabel', 'Sergio', 'Alicia', 'Roberto', 'Paula', 'Manuel', 'Laura', 'Jose', 'Sara', 'Francisco', 'Maria', 'Antonio', 'Carmen', 'Juan', 'Ana',
    'Luis', 'Maria', 'Carlos', 'Sofia', 'Javier', 'Laura', 'Pedro', 'Lucia', 'Andres', 'Elena', 'Marta', 'Diego', 'Carla',
    'Fernando', 'Isabel', 'Sergio', 'Alicia', 'Roberto', 'Paula', 'Manuel', 'Laura', 'Jose', 'Sara'
];
export class Personaje {
    constructor(img, nombre, vida, vida_max, ataque, tipo, precio, uso, max_uso) {
        this.img = img;
        this.nombre = nombre;
        this.vida = vida;
        this.vida_max = vida_max;
        this.ataque = ataque;
        this.tipo = tipo;
        this.precio = precio;
        this.uso = uso;
        this.max_uso = max_uso;
    }
    toString() {
        return `${this.img} ${this.nombre} (${this.tipo}) - HP:${this.vida},HP MAX:${this.vida_max}, ATQ:${this.ataque}, Precio:${this.precio} - \n\n `;
    }
}
