import { Personaje } from "./personajes.js";
export let imagenes_mago=['../img/img_personaje/mago_1.png','../img/img_personaje/mago_2.png','../img/img_personaje/mago_3.png','../img/img_personaje/mago_4.png'];
export class mago extends Personaje {

    bola_do_fogo() {
        let mensaje = "";
        if (this.uso <= 0) {
            let daño_total = this.ataque;
            mensaje = ` ${this.nombre} <span class='text-info'> NO tienes mas intento de habilidad especial</span>, su ataque fue <span class='text-danger'>${daño_total}</span>`;
            return  { daño: daño_total, mensaje: mensaje }; // hace ataque normal
        }
        this.uso--; // consume 1 uso
        
        let daño_total = 60;
        mensaje=`${this.nombre} <span class='text-info'> Has usado su ataque especial te quedan : ${this.uso}</span> su ataque fue de <span class='text-danger'> ${daño_total} </span>`;
        return  { daño: daño_total, mensaje: mensaje };
    }

}