import { random, nombre_aleatorio, cargarSesion, guardarSesion, cargarDatosPantalla } from "./funciones.js";
import { tienda } from "./tienda.js";
import { nombre, Personaje } from "./personajes.js";
import { guerrero, imagen_guerrero } from "./guerrero.js";
import { imagenes_mago, mago } from "./mago.js";
import { imagenes_ladron, ladron } from "./ladron.js";


export function generarTienda(): tienda {
    let indice:number = 0;
    let cantidad_personajes:number = 0;
    const personajesTienda: Personaje[] = [];

    while (cantidad_personajes < 3) {
        let azar = random(0, 100);
        let personaje: Personaje;
        if (azar < 20) {
            personaje = new mago(nombre_aleatorio(imagenes_mago), nombre_aleatorio(nombre), random(40, 60), random(40, 60), random(10, 20), "mago", 2000, 1, 1);
            if (personaje.vida != personaje.vida_max) { // ponemos que si la vida es diferente a la vida_max  hacemos que sean iguales
                personaje.vida = personaje.vida_max; //nos servira para la recuperacion 
            }
        } else if (azar < 50) {
            personaje = new ladron(nombre_aleatorio(imagenes_ladron), nombre_aleatorio(nombre), random(50, 80), random(50, 80), random(10, 20), "ladron", 1500, 2, 2);
            if (personaje.vida != personaje.vida_max) {
                personaje.vida = personaje.vida_max;
            }
        } else {
            personaje = new guerrero(nombre_aleatorio(imagen_guerrero), nombre_aleatorio(nombre), random(60, 100), random(60, 100), random(10, 20), "guerrero", 1000, 3, 3);
            if (personaje.vida != personaje.vida_max) {
                personaje.vida = personaje.vida_max;
            }
        }

        indice++;
        personajesTienda.push(personaje);
        cantidad_personajes++;
    }

    return new tienda(indice, personajesTienda);
}

export function mostrarTienda(): tienda | void {
    
     const miTienda = generarTienda();
     const listarPersonajes= miTienda.personaje;
     const contenedorTienda= document.getElementById("contenedor-tienda") as HTMLElement;
      let partida = cargarSesion();
        if(!contenedorTienda) return miTienda;
          if(!partida) return miTienda;
        
        if(partida.intento <= 0||partida.mi_grupo.length > 5||partida.dinero<1000) {
            window.location.href="juego.html";
            return;
        }
        contenedorTienda.innerHTML = "";
        const promesasCarga = listarPersonajes.map((personaje, indice) => {
        // 1. Creamos la columna
        const col = document.createElement("div");


        // 2. MOSTRAR EL GIF INICIALMENTE
        // Mientras se "busca" al personaje, mostramos un GIF de carga
        col.innerHTML = `
            <div id="loader-${indice}" class="text-center py-5 m-4">
                <img src="/gift/load.gif" alt="Buscando..." style="width:250px;">
                <p class="text-white mt-2">Buscando...</p>
            </div>
        `;
// Agregamos la columna al contenedor antes de iniciar la promesa para que el GIF se muestre inmediatamente
        contenedorTienda.appendChild(col);

        // 3. Promesa individual para este personaje
        let tiempoAleatorio = random(1, 5) * 1000;

        const promesaAparicion = new Promise<void>((resolve, reject) => {
            // Ejemplo de error: Si el personaje no tiene nombre, rechazamos
            if (!personaje.nombre) {
                reject("Datos del personaje corruptos");
                return;
            }

            setTimeout(() => {
                resolve();
            }, tiempoAleatorio);
        });

        // 4. Cuando la promesa se resuelve, mostramos el personaje
        return promesaAparicion
            .then(() => {
                col.innerHTML = `
                    <div class="card bg-dark text-white border-primary bg-opacity-75 mb-4 img-fluid" style="box-shadow: 0 10px 20px rgba(255, 0, 0, 0.5);">
                        <h5 class="card-title text-center py-2">${personaje.nombre} (${personaje.tipo})</h5>
                        <img src="${personaje.img}" class="card-img-top img-fluid">
                        <div class="card-body">
                            <p class="m-0">❤️ Vida: ${personaje.vida_max} | ⚔️ ATQ: ${personaje.ataque}</p>
                            <p class="text-warning fw-bold">💰 $${personaje.precio}</p>
                            
                            <button class="btn btn-sangre w-100 mt-2" id="btn-comprar-${indice}">
                                CONTRATAR
                            </button>
                        </div>
                    </div>
                `;

                let botoncompra = document.getElementById(`btn-comprar-${indice}`) as HTMLButtonElement;
                if (botoncompra) {
                    botoncompra.disabled = true;
                    botoncompra.addEventListener("click", () => {
                        procesarCompra(personaje);
                    });
                }

                return { botoncompra, personaje };
            })
            // 3. CASO ERROR: Si algo sale mal, mostramos este aviso
            .catch((error) => {
                console.error("Error al cargar personaje:", error);
                col.innerHTML = `
                    <div class="alert alert-danger text-center mb-4">
                        <p class="m-0 small">⚠️ No se pudo reclutar a este guerrero.</p>
                    </div>
                `;

                return null;
            });
    });

    Promise.all(promesasCarga)
        .then((resultados) => {
            const partidaActual = cargarSesion();
            if (!partidaActual) return;

            resultados.forEach((resultado) => {
                if (!resultado || !resultado.botoncompra) return;

                if (partidaActual.dinero >= resultado.personaje.precio && partidaActual.mi_grupo.length < 5) {
                    resultado.botoncompra.disabled = false;
                }
            });
        })
        .catch((error) => {
            console.error("Error al completar la carga de la tienda:", error);
        });
}

function procesarCompra(personaje: Personaje): void {
    const partida = cargarSesion();
    if (!partida) return;

    if (partida.dinero < personaje.precio || partida.mi_grupo.length >= 5) {
        return;
    }

    partida.dinero -= personaje.precio;
    partida.mi_grupo.push(personaje);
    guardarSesion(partida);
    cargarDatosPantalla();
    mostrarTienda();
}