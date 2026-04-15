

export let nombre :string[] = [
    'raul', 'ana', 'luis', 'maria', 'carlos', 'sofia',
    'javier', 'laura', 'pedro', 'lucia', 'andres', 'elena','marta', 'diego', 'carla', 'fernando', 'isabel', 'sergio', 'alicia', 'roberto', 'paula', 'manuel', 'laura', 'jose', 'sara', 'francisco', 'maria', 'antonio', 'carmen', 'juan', 'ana',
    'luis', 'maria', 'carlos', 'sofia', 'javier', 'laura', 'pedro', 'lucia', 'andres', 'elena','marta', 'diego', 'carla',
    'fernando', 'isabel', 'sergio', 'alicia', 'roberto', 'paula', 'manuel', 'laura', 'jose', 'sara'
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