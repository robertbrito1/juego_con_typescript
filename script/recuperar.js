import { cargarSesion, guardarSesion } from "./funciones.js";
import { mostrarGrupoVisual } from "./informacion.js";
export function curar() {
    let partida = cargarSesion(); // Aseguramos que el tipo es datos, aunque cargarSesion ya lo devuelve como datos | null, aquí asumimos que no es null porque esta función solo se llama cuando se puede curar.
    // Aquí es donde ocurre la magia de la curación: recorremos cada personaje y aplicamos la lógica de curación
    partida.mi_grupo = partida.mi_grupo.map(personaje => {
        let curacion = Math.floor(personaje.vida_max * 0.7);
        if (personaje.vida <= 0) {
            personaje.vida = curacion; // Si el personaje está muerto, lo revivimos con el 70% de su vida máxima
            // Si el personaje tiene un uso limitado, le recuperamos el uso máximo también
            if (personaje.max_uso)
                personaje.uso = personaje.max_uso;
            //si está vivo pero perdió vida le recuperamos la vida pero no el uso
        }
        else {
            personaje.vida += curacion;
            //si el personaje tiene menos uso que max uso se lo recuperamos 
            if (personaje.uso < personaje.max_uso) {
                personaje.uso = personaje.max_uso;
            }
        }
        // Limitar a la vida máxima
        if (personaje.vida > personaje.vida_max) {
            personaje.vida = personaje.vida_max;
        }
        return personaje;
    });
    // Después de curar a todos los personajes, actualizamos el estado de recuperación para evitar abusos
    partida.se_recupera = false; // Esto es fundamental para que el jugador no pueda curar infinitamente sin pasar por la tienda o la batalla
    // GUARDAR CAMBIOS: Esto es lo más importante
    guardarSesion(partida);
    // Actualización visual
    const btnCurar = document.getElementById("btn-curar");
    if (btnCurar)
        btnCurar.disabled = true;
    mostrarGrupoVisual(partida.mi_grupo);
    // Modal que muestra que se han curado los personajes
    const modalElement = document.getElementById('curar_informacion');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}
