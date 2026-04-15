import { cargarDatosPantalla, cargarSesion, guardarSesion } from "./funciones.js";
import { Personaje } from "./personajes";
import { datos } from "./variables";

export function mostrarGrupoVisual(lista: Personaje[]) {
    // Obtenemos el contenedor donde se mostrarán los personajes
    const contenedor = document.getElementById("mi-equipo") as HTMLElement;

    if (contenedor) {
        contenedor.innerHTML = "";

        
//mostramos el grupo visualmente con sus stats y un botón para despedirlos
        lista.forEach((personaje , indice) => {
            const col = document.createElement("div");
            col.className = "col-auto mb-4";
            col.innerHTML = `
            <div class="card bg-dark text-white border-primary bg-opacity-75 h-100" 
                style="box-shadow: 0 10px 20px rgba(255, 0, 0, 0.5); width: 160px; min-height: 250px;">
                <h6 class="card-title text-center py-2 m-0" style="background: rgba(0,0,0,0.3); font-size: 0.9rem;">
                    ${personaje.nombre}
                </h6>
                <img src="${personaje.img}" class="card-img-top" style="height: 200px; object-fit: cover;">
                <div class="card-body p-2 d-flex flex-column justify-content-center" style="font-size: 0.75rem;">
                    <p class="m-0 text-center">❤️ Vida: ${personaje.vida}/${personaje.vida_max}</p>
                    <p class="m-0 text-center">⚔️ ATQ: ${personaje.ataque}</p>
                    <p class="m-0 text-center text-info text-uppercase fw-bold">${personaje.tipo}</p>
                </div>
                <button class="btn btn-sangre btn-sm w-100 mt-auto" id="btn-despedir-${indice}">
                    DESPEDIR
                </button>
            </div>
        `;
            contenedor.appendChild(col);
// Agregamos el evento al botón de despedir
            document.getElementById(`btn-despedir-${indice}`).onclick = () => despedir(indice);
        });
    }

}// Función para despedir a un personaje del grupo
export function despedir(indice: number) {
    // 1. Obtenemos los datos actuales
    let partida = cargarSesion() as datos; // Aseguramos que no sea null, ya que esta función solo se llama si hay una partida cargada

    // 2. Calculamos el reembolso y quitamos al personaje del array
    let personaje = partida.mi_grupo[indice];
    partida.dinero += (personaje.precio / 2);
    
    // Quitar del array
    partida.mi_grupo.splice(indice, 1);
    
    // 3. Guardar los cambios
    guardarSesion(partida);

    // 4. Modal de confirmación (Bootstrap)
    const modalElement = document.getElementById('despedir_ventana');
    if (modalElement) {
        
        const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
    }

    //si siemrpe hacemos algo con los datos de la partida, es mejor actualizar con la funcion cargarDatosPantalla que se encarga de actualizar todo lo relacionado con la partida, asi evitamos errores y mantenemos el codigo mas limpio
    cargarDatosPantalla();               // Actualiza el oro y textos de la interfaz
    mostrarGrupoVisual(partida.mi_grupo); // Dibuja el grupo actualizado sin el personaje despedido
}