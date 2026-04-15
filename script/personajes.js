export let nombre = [
    'raul', 'ana', 'luis', 'maria', 'carlos', 'sofia',
    'javier', 'laura', 'pedro', 'lucia', 'andres', 'elena', 'marta', 'diego', 'carla', 'fernando', 'isabel', 'sergio', 'alicia', 'roberto', 'paula', 'manuel', 'laura', 'jose', 'sara', 'francisco', 'maria', 'antonio', 'carmen', 'juan', 'ana',
    'luis', 'maria', 'carlos', 'sofia', 'javier', 'laura', 'pedro', 'lucia', 'andres', 'elena', 'marta', 'diego', 'carla',
    'fernando', 'isabel', 'sergio', 'alicia', 'roberto', 'paula', 'manuel', 'laura', 'jose', 'sara'
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
