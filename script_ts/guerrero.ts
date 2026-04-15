import { Personaje } from "./personajes.js";

export let imagen_guerrero = ['../img/img_personaje/guerrero_1.png', '../img/img_personaje/guerrero_2.png', '../img/img_personaje/guerrero_3.png', '../img/img_personaje/guerrero_4.png'];

export class guerrero extends Personaje {

    ataque_especial (damage_adicional :number) {
        let mensaje = "";
        let daño_total = 0;

        if (this.uso <= 0) {
            daño_total  = this.ataque;
            mensaje  = `${this.nombre} <span class='text-info'>No quedan más ataques especiales</span>, ha atacado con su fuerza base:<span class='text-danger'> ${this.ataque}</span>`;

            // 2. Retornamos un objeto con ambas propiedades
            return { daño: daño_total, mensaje: mensaje };
        }

        this.uso--;
        daño_total = this.ataque + damage_adicional;
        mensaje = `${this.nombre} <span class='text-info'> Ha usado su ataque especial. Le quedan ${this.uso}</span>. Su ataque fue de: <span class='text-danger'>${daño_total}</span>`;

        return { daño: daño_total, mensaje: mensaje };
    }

}