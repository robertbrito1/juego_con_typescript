import { generarTienda } from "./funciones_tienda.js";
import { random } from "./funciones.js";
//generamos el equipo ia con el generar tienda y hacemos que el rando elija un numero para asi elegir el personaje
export function generar_equipo_ia(numero_personaje, equipo_ia) {
    for (let i = 0; i < numero_personaje; i++) { // bucle para agregar el personaje
        let tienda_ia = generarTienda(); // llamamos funciontienda y genera tres opciones 
        let numero_a_escoger = random(0, 3 - 1); // llamamos al random para que sea el numero a escoger 
        let presonaje_ia = tienda_ia.personaje[numero_a_escoger]; // el personaje es la opcion escogida en la tienda ia;
        equipo_ia.push(presonaje_ia); //agregamos 
    }
    return equipo_ia;
}
