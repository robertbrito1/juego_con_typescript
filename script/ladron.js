import { Personaje } from "./personajes.js";
export let imagenes_ladron = ['../img/img_personaje/ladron_1.png', '../img/img_personaje/ladron_2.png', '../img/img_personaje/ladron_3.png', '../img/img_personaje/ladron_4.png'];
export class ladron extends Personaje {
    constructor(img, nombre, vida, vida_max, ataque, tipo, precio, uso, max_uso, mensaje = "") {
        super(img, nombre, vida, vida_max, ataque, tipo, precio, uso, max_uso);
        this.mensaje = mensaje;
    }
    habilidad_especial() {
        if (this.uso > 0) {
            const azar = Math.floor(Math.random() * 100);
            const probabilidad_esquivar = 35;
            if (probabilidad_esquivar >= azar) {
                this.uso--;
                // GUARDAMOS EN THIS PARA QUE NO SEA UNDEFINED
                this.mensaje = `<span class='text-info'>Has escapado</span>, te quedan <span class='text-warning'> ${this.uso} intentos</span>`;
                return true; // Devolvemos solo true para que tu IF funcione
            }
            else {
                this.mensaje = `<span class='text-danger'>Has intentado escapar pero has fallado</span>`;
                return false;
            }
        }
        this.mensaje = `Ya no te quedan más intentos para escapar`;
        return false;
    }
}
