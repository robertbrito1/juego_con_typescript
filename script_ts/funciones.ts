// imports
import { datos } from "./variables.js";
import { mostrarTienda } from "./funciones_tienda.js";
import { mostrarGrupoVisual } from "./informacion.js";
import { curar } from "./recuperar.js";
import { recuperar_combate } from "./combate.js";






export function random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function guardarSesion(partida: datos) {
    sessionStorage.setItem("partida_actual", JSON.stringify(partida));
}
export function cargarSesion(): datos | null {
    const partidaJSON = sessionStorage.getItem("partida_actual");
    if (partidaJSON) {
        return JSON.parse(partidaJSON) as datos;
    }
    return null;
}
export function nombre_aleatorio(lista: string[]): string {
    const indice = Math.floor(Math.random() * lista.length); 
    return lista[indice];
}
export function crearNuevaPartida(modo: "normal" | "dificil") {
    const partidaActual = new datos(
        5000,       // dinero
        6,          // intento
        [],         // grupo_cpu
        [],         // mi_grupo
        false,      // se_recupera
        0,          // victorias cpu
        0,          // victorias jugador
        modo        // "normal" o "dificil"
    );

    // Guardamos en el baúl del navegador
    guardarSesion(partidaActual);

    // Redirigimos
    window.location.href = "./html/juego.html";
}

type Seccion = "tienda" | "grupo" | "batalla" | "recuperacion";
export function cargar_secciones(archivos:string ,tiposeccion: Seccion){
    
    const contenedorPrincipal=document.getElementById("contenedor-juego") as HTMLElement;
    if(!contenedorPrincipal) return;
    
    fetch(archivos)
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar: " + archivos);
            return response.text();
        })
        .then(html => {
            contenedorPrincipal.innerHTML = html;

            switch (tiposeccion) {
                case "tienda":
                    mostrarTienda();
                    break;

                case "grupo": {
                    mostrarGrupoVisual(cargarSesion().mi_grupo);
                    const btnCurar = document.getElementById("btn-curar") as HTMLButtonElement;
                    if (btnCurar) {
                        const partida = cargarSesion();
                        if (partida && partida.se_recupera === true) {
                            btnCurar.disabled = false;
                            btnCurar.onclick = () => {
                                curar();
                                btnCurar.disabled = true;
                            };
                        } else {
                            btnCurar.disabled = true;
                        }
                    }
                    break;
                }

                case "batalla":
                    recuperar_combate();
                    break;
            }
        })
        .catch(error => console.error("Error al cargar la sección:", error));
}
export function cargarDatosPantalla() {
    // Recuperamos los datos de la partida actual desde sessionStorage
    let datosRecuperados = cargarSesion();
// Si hay datos, los parseamos y actualizamos la interfaz
    if (datosRecuperados) {
        // Convertimos el JSON de vuelta a un objeto JavaScript para acceder a sus propiedades
        let partida = datosRecuperados as datos;
        
        // --- NUEVA LÓGICA: ¿VENIMOS DE UN COMBATE? ---


        // Actualizamos los textos de la pantalla
        if (document.getElementById("victoria")) {
            if(partida.dificultad === "dificil") {
            document.getElementById("victoria").innerText = `🏆 Victorias: ${partida.contador_victoria_jugador} / 4 `
            } else {
                document.getElementById("victoria").innerText = `🏆 Victorias: ${partida.contador_victoria_jugador} / 2`
            }
        }

        if (document.getElementById("dinero")) document.getElementById("dinero").innerText = `💰 Oro: ${partida.dinero}`;
        if (document.getElementById("derrota")) document.getElementById("derrota").innerText = `💀 Derrota: ${partida.contador_victoria_cpu} / 2`;
        if (document.getElementById("intentos")) document.getElementById("intentos").innerText = `🛒 Intento de compra: ${partida.intento}`;
        if (document.getElementById("informacion")) document.getElementById("informacion").innerText = `👥 Miembros: ${partida.mi_grupo.length}`;
// Si estamos en la pantalla de información, también actualizamos el número de personajes
        actualizarMarcadoresVisuales(partida);
        comprobacion_de_victoria();
    }
}
export function actualizarMarcadoresVisuales(partida: datos) {
    const dineroTexto = document.getElementById("dinero");
    const intentosTexto = document.getElementById("intentos");
    if (dineroTexto) dineroTexto.innerText = `💰 Oro: ${partida.dinero}`;
    if (intentosTexto) intentosTexto.innerText = `🛒 Intento de compra: ${partida.intento}`;
}
export function comprobacion_de_victoria() :boolean{
    // Recuperamos los datos de la partida actual desde sessionStorage para verificar las condiciones de victoria o derrota.
    let datos = cargarSesion();
    // Si no hay datos, no hacemos nada para evitar errores.
    if (!datos) return false;
// Verificamos las condiciones de victoria o derrota según el número de victorias del jugador y la CPU, la dificultad, y el estado del grupo e intentos.
    const win = (datos.contador_victoria_jugador >= 2 && datos.dificultad === 'normal') ||
        (datos.contador_victoria_jugador >= 4 && datos.dificultad === 'dificil');
        
        // La condición de derrota se cumple si la CPU alcanza 2 victorias o si el jugador se queda sin personajes y sin intentos para comprar más.
    const lose = (datos.contador_victoria_cpu >= 2) || (datos.mi_grupo.length === 0 && datos.intento === 0);

// Si se cumple alguna de las condiciones, redirigimos al jugador a la pantalla de victoria o derrota según corresponda.
    if (win || lose) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = win ? "victoria.html" : "derrota.html";
        return true;
    }

    return false;
}
