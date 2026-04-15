import { cargar_secciones, cargarDatosPantalla, cargarSesion, crearNuevaPartida, guardarSesion, random } from "./funciones.js";
import { guardar } from "./carga_guardar.js";
import { nuevo_combate, refrescar_pantalla } from "./combate.js";
import { generar_equipo_ia } from "./grupoCPU.js";
document.addEventListener('DOMContentLoaded', () => {
    const btnNormal = document.getElementById('empezar_normal');
    const btnDificil = document.getElementById('empezar_dificil');
    if (btnNormal) {
        btnNormal.addEventListener("click", () => crearNuevaPartida("normal"));
    }
    if (btnDificil) {
        btnDificil.addEventListener("click", () => crearNuevaPartida("dificil"));
    }
});
document.addEventListener("DOMContentLoaded", () => {
    cargarDatosPantalla();
    let datos = cargarSesion();
    if (!datos)
        return;
    const btnContratar = document.getElementById("contratar");
    if (btnContratar) {
        // Si no hay intentos, dinero o espacio en el grupo, deshabilitamos el botón para evitar que el jugador entre a la tienda sin poder comprar nada.
        if (datos.intento == 0 || datos.mi_grupo.length >= 5 || datos.dinero < 1000) {
            btnContratar.disabled = true;
            datos.intento = 0;
            guardarSesion(datos); // Guardamos el estado actualizado para que se refleje en la tienda
        }
        else {
            btnContratar.addEventListener('click', () => {
                // 1. RE-LEEMOS: Fundamental para no perder personajes comprados antes
                datos = cargarSesion();
                if (datos.intento > 0 && datos.dinero >= 1000 && datos.mi_grupo.length < 6) {
                    // 2. ACTUALIZAMOS EL ESTADO
                    datos.intento -= 1;
                    // Guardamos los cambios en el sessionStorage para que estén disponibles en la tienda
                    guardarSesion(datos);
                    // 3. ACTUALIZAMOS INTERFAZ
                    cargar_secciones('./contratar.html', 'tienda');
                }
            });
        }
    }
    // 3. BOTÓN GRUPO (Entrada a la información)
    const btn_grupo = document.getElementById("btn-ir-info");
    if (btn_grupo) {
        // Si el grupo está vacío, deshabilitamos el botón para evitar que el jugador entre a la información sin tener personajes que mostrar.
        if (datos.mi_grupo.length == 0) {
            btn_grupo.disabled = true;
        } // Si el grupo tiene personajes, habilitamos el botón y le asignamos la función para cargar la sección de información al hacer clic. 
        else {
            btn_grupo.disabled = false;
            btn_grupo.addEventListener("click", () => {
                //cargamos la sección de información para mostrar el grupo y sus detalles
                cargar_secciones('../../html/informacion.html', 'grupo');
            });
        }
    }
    const btnGuardar = document.getElementById("guardar");
    if (btnGuardar) {
        btnGuardar.addEventListener("click", () => {
            // Guardamos la partida actual en el localStorage para que esté disponible incluso después de cerrar el navegador.
            const partidaActual = cargarSesion();
            if (!partidaActual)
                return;
            guardar(partidaActual);
            const modal = document.getElementById('modalGuardado');
            if (modal)
                new bootstrap.Modal(modal).show();
        });
    }
    const btnCombate = document.getElementById("btn-combate");
    btnCombate.addEventListener("click", (e) => {
        if (btnCombate) {
            //
            e.preventDefault();
            btnCombate.disabled = datos.mi_grupo.length === 0;
            btnCombate.addEventListener("click", (e) => {
                // generamos a la ia 
                let equipo_enemigo = generar_equipo_ia(random(3, 5), []);
                // 2. Inicializar el combate (Asegúrate de que esto guarde los datos en un lugar accesible)
                const pelea = nuevo_combate(datos.mi_grupo, equipo_enemigo);
                refrescar_pantalla(pelea);
                // 3. Cargar la sección mediante FETCH (sin cambiar de URL)
                cargar_secciones('../../html/combate.html', 'batalla');
            });
        }
    });
});
