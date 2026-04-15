

export let nombre :string[] = [
    'Raul', 'Ana', 'Luis', 'Maria', 'Carlos', 'Sofia',
    'Javier', 'Laura', 'Pedro', 'Lucia', 'Andres', 'Elena','Marta', 'Diego', 'Carla', 'Fernando', 'Isabel', 'Sergio', 'Alicia', 'Roberto', 'Paula', 'Manuel', 'Laura', 'Jose', 'Sara', 'Francisco', 'Maria', 'Antonio', 'Carmen', 'Juan', 'Ana',
    'Luis', 'Maria', 'Carlos', 'Sofia', 'Javier', 'Laura', 'Pedro', 'Lucia', 'Andres', 'Elena','Marta', 'Diego', 'Carla',
    'Fernando', 'Isabel', 'Sergio', 'Alicia', 'Roberto', 'Paula', 'Manuel', 'Laura', 'Jose', 'Sara'
]
export class Personaje {
    img :string;
    nombre :string;
    vida :number;
    vida_max :number;
    ataque :number;
    tipo :string;
    precio :number;
    uso :number;
    max_uso :number;
    constructor(img :string,nombre:string,vida:number,vida_max:number,ataque:number,tipo:string,precio:number,uso:number,max_uso:number){
        this.img=img;
        this.nombre =nombre;
        this.vida =vida;
        this.vida_max =vida_max;
        this.ataque =ataque;
        this.tipo =tipo;
        this.precio =precio;
        this.uso =uso;
        this.max_uso=max_uso;
    }
    
    toString() {
        return `${this.img} ${this.nombre} (${this.tipo}) - HP:${this.vida},HP MAX:${this.vida_max}, ATQ:${this.ataque}, Precio:${this.precio} - \n\n `;
    }
}