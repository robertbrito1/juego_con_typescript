export class tienda {
    constructor(indice, personaje) {
        this.indice = indice;
        this.personaje = personaje;
    }
    toString() { return ` ${this.indice} ${this.personaje} `; }
}
