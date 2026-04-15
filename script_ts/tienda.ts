
import { Personaje } from "./personajes.js";

export class tienda {
    indice: number;
    personaje: Personaje[];
    constructor(indice: number, personaje: Personaje[]) {
        this.indice = indice;
        this.personaje = personaje;
    }
    
    toString() { return ` ${this.indice} ${this.personaje} `; }
}


