import { random, cargarSesion, guardarSesion, comprobacion_de_victoria } from "./funciones.js";
import { guerrero } from "./guerrero.js";
import { mago } from "./mago.js";
import { ladron } from "./ladron.js";
// ============================================================
//  CLASE COMBATE — Controla toda la pelea entre dos equipos
// ============================================================
export class Combate {
    constructor(aliados, enemigos) {
        this.equipo_aliado = aliados;
        this.equipo_enemigo = enemigos;
        this.turno_aliado = 0;
        this.turno_enemigo = 0;
        this.bajas_aliadas = 0;
        this.bajas_enemigas = 0;
        this.oro_ronda = 0;
        this.oro_total = 0;
        this.finalizado = false;
        this.resultado_guardado = false;
    }
    // ── Personaje activo de cada equipo ──
    get aliado_actual() {
        return this.equipo_aliado[this.turno_aliado] ?? null;
    }
    get enemigo_actual() {
        return this.equipo_enemigo[this.turno_enemigo] ?? null;
    }
    // ── Ejecutar un turno completo ──
    ejecutar_turno() {
        if (this.finalizado)
            return;
        this.oro_ronda = 0; // se reinicia cada turno
        const aliado = this.aliado_actual;
        const enemigo = this.enemigo_actual;
        if (!aliado || !enemigo)
            return;
        let resumen = "";
        // 1. El aliado ataca primero
        resumen += atacar(aliado, enemigo) + "<br>";
        // 2. Si el enemigo sigue vivo, contraataca
        if (enemigo.vida > 0) {
            resumen += atacar(enemigo, aliado) + "<br>";
        }
        // 3. Revisamos si alguien cayó
        resumen += this.revisar_bajas();
        // 4. Mostramos todo el resumen de una vez
        escribir_log(resumen);
        // 5. Guardamos el estado en sessionStorage
        sessionStorage.setItem("combateActual", JSON.stringify(this));
    }
    // ── Revisar muertes y avanzar posiciones ──
    revisar_bajas() {
        const aliado = this.equipo_aliado[this.turno_aliado];
        const enemigo = this.equipo_enemigo[this.turno_enemigo];
        let texto = "";
        // ¿Murió el enemigo?
        if (enemigo && enemigo.vida <= 0) {
            enemigo.vida = 0;
            this.turno_enemigo++;
            this.bajas_enemigas++;
            this.oro_ronda += 500;
            this.oro_total += 500;
            texto += `<span class="text-warning">💀 El enemigo ${enemigo.nombre} ha caído.</span><br>`;
        }
        // ¿Murió el aliado?
        if (aliado && aliado.vida <= 0) {
            aliado.vida = 0;
            this.turno_aliado++;
            this.bajas_aliadas++;
            texto += `<span class="text-danger">💀 Tu aliado ${aliado.nombre} ha muerto.</span><br>`;
        }
        // ¿Alguien ganó?
        let victoria = null;
        if (this.turno_enemigo >= this.equipo_enemigo.length) {
            victoria = true; // ganaste: no quedan enemigos
        }
        else if (this.turno_aliado >= this.equipo_aliado.length) {
            victoria = false; // perdiste: no quedan aliados
        }
        // Si hay resultado, marcamos el combate como finalizado
        if (victoria !== null) {
            this.finalizado = true;
            const resultado = {
                ganado: victoria,
                oroTotal: this.oro_total,
                mensaje: victoria ? "¡VICTORIA ÉPICA!" : "HAS SIDO DERROTADO"
            };
            sessionStorage.setItem("resultadoCombate", JSON.stringify(resultado));
        }
        return texto;
    }
}
// ============================================================
//  FUNCIONES DE COMBATE
// ============================================================
/**
 * Inicia un nuevo combate y lo guarda en sessionStorage.
 */
export function nuevo_combate(aliados, enemigos) {
    const pelea = new Combate(aliados, enemigos);
    sessionStorage.setItem("combateActual", JSON.stringify(pelea));
    return pelea;
}
/**
 * Calcula el ataque de un personaje según su tipo y aplica ventaja de tipos.
 * Devuelve el texto HTML del resumen de la acción.
 */
export function atacar(atacante, defensor) {
    let daño_base = 0;
    let mensaje = "";
    // ── Cada tipo ataca diferente ──
    if (atacante.tipo === "guerrero") {
        const resultado = atacante.ataque_especial(random(5, 10));
        daño_base = resultado.daño;
        mensaje += resultado.mensaje;
    }
    else if (atacante.tipo === "mago") {
        const resultado = atacante.bola_do_fogo();
        daño_base = resultado.daño;
        mensaje += resultado.mensaje;
    }
    else if (atacante.tipo === "ladron") {
        daño_base = atacante.ataque;
        mensaje += `💥 ${atacante.nombre} atacó y quitó <span class='text-danger'>${daño_base}</span> HP a ${defensor.nombre}`;
    }
    // ── Si el defensor es ladrón, intenta esquivar ──
    if (defensor.tipo === "ladron") {
        const ladronDef = defensor;
        if (ladronDef.habilidad_especial()) {
            // Esquivó: el daño se cancela
            return `💨 ${defensor.nombre} ${ladronDef.mensaje}`;
        }
        // Falló la esquiva: añadimos el aviso pero seguimos
        mensaje += ` ❌ ${ladronDef.mensaje}. `;
    }
    // ── Ventaja de tipos (piedra-papel-tijera) ──
    const tiene_ventaja = (atacante.tipo === "guerrero" && defensor.tipo === "ladron") ||
        (atacante.tipo === "ladron" && defensor.tipo === "mago") ||
        (atacante.tipo === "mago" && defensor.tipo === "guerrero");
    const daño_final = tiene_ventaja ? Math.round(daño_base * 1.5) : daño_base;
    // ── Aplicar daño ──
    defensor.vida -= daño_final;
    if (tiene_ventaja) {
        mensaje += `<p class='text-warning'>¡Es muy efectivo! (Total: ${daño_final})</p>`;
    }
    return mensaje;
}
// ============================================================
//  FUNCIONES VISUALES — Pintar la pantalla de combate
// ============================================================
/**
 * Escribe un mensaje en el log de batalla con animación.
 */
export function escribir_log(mensaje) {
    const log = document.getElementById("log-batalla");
    if (!log)
        return;
    log.innerHTML = mensaje;
    // Reiniciamos la animación de aparición
    log.style.animation = "none";
    log.offsetHeight; // forzar reflow
    log.style.animation = "fadeIn 10s forwards";
}
/**
 * Dibuja las tarjetas de aliado vs enemigo en la zona de combate.
 */
export function mostrar_duelo(aliado, enemigo) {
    const contenedor = document.getElementById("zona-combate");
    if (!contenedor)
        return;
    contenedor.innerHTML = `
        <div class="row justify-content-between align-items-center w-100 m-0">

            <!-- TARJETA ALIADO -->
            <div class="col-5 col-md-4 d-flex justify-content-center">
                <div class="card bg-dark text-white border-primary border-5 shadow-lg w-100"
                     style="max-width: 14rem; box-shadow: 5px 5px 15px blue">
                    <h5 class="card-title text-center mt-2">${aliado ? aliado.nombre : "DERROTADO"}</h5>
                    <img src="${aliado ? aliado.img : ""}" class="card-img-top px-2">
                    <div class="card-body p-2 text-center">
                        <p class="m-0">❤️ Vida: ${aliado ? aliado.vida : 0}</p>
                        <p class="m-0">⚔️ ATQ: ${aliado ? aliado.ataque : 0}</p>
                        <p class="m-0 text-info fw-bold">tipo: ${aliado ? aliado.tipo : "-"}</p>
                    </div>
                </div>
            </div>

            <!-- BOTÓN VS -->
            <div class="col-2 text-center">
                <button id="boton-atacar" 
        class="btn btn-danger rounded-circle shadow-lg fw-bold border border-4 border-white
               p-2  fs-6     /* Pequeño en móvil */
               p-md-4 fs-md-3 /* Grande en tablets/PC */">
                    VS
                </button>
            </div>

            <!-- TARJETA ENEMIGO -->
            <div class="col-5 col-md-4 d-flex justify-content-center">
                <div class="card bg-dark text-white border-danger border-5 shadow-lg w-100"
                     style="max-width: 14rem; box-shadow: -5px 5px 15px red">
                    <h5 class="card-title text-center mt-2">${enemigo ? enemigo.nombre : "DERROTADO"}</h5>
                    <img src="${enemigo ? enemigo.img : ""}" class="card-img-top px-2">
                    <div class="card-body p-2 text-center">
                        <p class="m-0">❤️ Vida: ${enemigo ? enemigo.vida : 0}</p>
                        <p class="m-0">⚔️ ATQ: ${enemigo ? enemigo.ataque : 0}</p>
                        <p class="m-0 text-warning fw-bold">tipo: ${enemigo ? enemigo.tipo : "-"}</p>
                    </div>
                </div>
            </div>

        </div>
    `;
}
/**
 * Actualiza los textos del panel lateral del combate (bajas, oro, etc.).
 */
export function actualizar_panel_combate(pelea) {
    const el = (id) => document.getElementById(id);
    if (el("aliado_derrotado"))
        el("aliado_derrotado").innerText = `💀 Aliados caídos: ${pelea.bajas_aliadas}`;
    if (el("enemigo_derrotados"))
        el("enemigo_derrotados").innerText = `🏆 Enemigos derrotados: ${pelea.bajas_enemigas}`;
    if (el("enemigo"))
        el("enemigo").innerText = `👾 Enemigos Totales: ${pelea.equipo_enemigo.length}`;
    if (el("informacion"))
        el("informacion").innerText = `⚔️ Aliados Totales: ${pelea.equipo_aliado.length}`;
    if (el("recompensa")) {
        let texto = `💰 Botín: +${pelea.oro_ronda}`;
        texto += ` (Total: ${pelea.oro_total})`;
        el("recompensa").innerText = texto;
    }
}
// ============================================================
//  REFRESCAR PANTALLA — Función principal que une todo
// ============================================================
/**
 * Actualiza tarjetas, panel, botón VS y detecta si el combate terminó.
 */
export function refrescar_pantalla(pelea) {
    const aliado = pelea.aliado_actual;
    const enemigo = pelea.enemigo_actual;
    // Pintamos las tarjetas y el panel lateral
    mostrar_duelo(aliado, enemigo);
    actualizar_panel_combate(pelea);
    // La vida del grupo se mantiene sincronizada con la partida mientras dura el combate.
    sincronizar_grupo_con_partida(pelea);
    // Guardamos el estado actualizado
    sessionStorage.setItem("combateActual", JSON.stringify(pelea));
    // Si el combate terminó, procesamos el resultado antes de cualquier otro return.
    if (pelea.finalizado) {
        mostrar_resultado_final(pelea);
        return;
    }
    // ── Si no quedan aliados vivos ──
    if (!aliado) {
        const btnVS = document.getElementById("boton-atacar");
        if (btnVS)
            btnVS.disabled = true;
        const aviso = document.getElementById("mensaje-no-aliado");
        if (aviso)
            aviso.innerText = "No tienes aliados disponibles. Redirigiendo al inicio...";
        setTimeout(() => { window.location.href = "juego.html"; }, 3000);
        return;
    }
    // ── Si el combate sigue activo: conectar el botón VS ──
    const btnVS = document.getElementById("boton-atacar");
    if (btnVS && !pelea.finalizado) {
        btnVS.innerText = "VS";
        btnVS.onclick = () => {
            pelea.ejecutar_turno();
            refrescar_pantalla(pelea);
        };
        return;
    }
}
/**
 * Actualiza los datos de la partida con el resultado del combate
 * y muestra el modal de victoria o derrota.
 */
function mostrar_resultado_final(pelea) {
    const ticket = sessionStorage.getItem("resultadoCombate");
    if (!ticket)
        return;
    const resultado = JSON.parse(ticket);
    const partida = cargarSesion();
    if (!partida)
        return;
    // Solo aplicamos el resultado una vez para no duplicar oro o victorias.
    if (!pelea.resultado_guardado) {
        partida.mi_grupo = pelea.equipo_aliado;
        partida.dinero += resultado.oroTotal;
        partida.intento = 6;
        partida.se_recupera = true;
        if (resultado.ganado) {
            partida.contador_victoria_jugador += 1;
        }
        else {
            partida.contador_victoria_cpu += 1;
        }
        pelea.resultado_guardado = true;
        guardarSesion(partida);
        sessionStorage.setItem("combateActual", JSON.stringify(pelea));
    }
    // ── Decidir qué modal mostrar ──
    const modal_victoria = document.getElementById("modal-victoria");
    const modal_derrota = document.getElementById("modal-derrota");
    const modal = (resultado.ganado && modal_victoria) ? modal_victoria : modal_derrota;
    if (!modal)
        return;
    // Mostramos el oro ganado dentro del modal
    const texto_oro = modal.querySelector("#modal-oro");
    if (texto_oro) {
        texto_oro.textContent = `💰 ORO TOTAL GANADO: +${resultado.oroTotal}`;
    }
    // Abrimos el modal (no se puede cerrar con clic fuera)
    const instancia = new bootstrap.Modal(modal, { backdrop: "static", keyboard: false });
    instancia.show();
    // Botón continuar: limpia el combate y vuelve al menú
    const btnContinuar = modal.querySelector("#btn-modal-continuar");
    if (btnContinuar) {
        btnContinuar.onclick = () => {
            sessionStorage.removeItem("combateActual");
            sessionStorage.removeItem("resultadoCombate");
            if (comprobacion_de_victoria())
                return;
            window.location.href = "juego.html";
        };
    }
}
// ============================================================
//  REHIDRATAR — Recuperar un combate guardado en sessionStorage
// ============================================================
/**
 * Lee el combate guardado, le devuelve los métodos a cada personaje
 * y refresca la pantalla para que el jugador continúe donde lo dejó.
 */
export function recuperar_combate() {
    const json = sessionStorage.getItem("combateActual");
    if (!json)
        return;
    const datos = JSON.parse(json);
    // Reconstruimos los equipos con sus clases reales
    const aliados = rehidratar_equipo(datos.equipo_aliado);
    const enemigos = rehidratar_equipo(datos.equipo_enemigo);
    // Creamos el objeto Combate con los equipos restaurados
    const pelea = new Combate(aliados, enemigos);
    // Sincronizamos el estado guardado
    pelea.turno_aliado = datos.turno_aliado ?? 0;
    pelea.turno_enemigo = datos.turno_enemigo ?? 0;
    pelea.bajas_aliadas = datos.bajas_aliadas ?? 0;
    pelea.bajas_enemigas = datos.bajas_enemigas ?? 0;
    pelea.oro_ronda = datos.oro_ronda ?? 0;
    pelea.oro_total = datos.oro_total ?? 0;
    pelea.finalizado = datos.finalizado ?? false;
    pelea.resultado_guardado = datos.resultado_guardado ?? false;
    // Mostramos el combate en pantalla
    refrescar_pantalla(pelea);
}
function sincronizar_grupo_con_partida(pelea) {
    const partida = cargarSesion();
    if (!partida)
        return;
    partida.mi_grupo = pelea.equipo_aliado;
    guardarSesion(partida);
}
/**
 * Convierte un array de objetos planos (JSON) de vuelta a instancias
 * reales de guerrero, mago o ladron para que tengan sus métodos.
 */
function rehidratar_equipo(lista) {
    if (!lista)
        return [];
    return lista.map(datos => {
        const tipo = String(datos.tipo ?? "guerrero").toLowerCase();
        let personaje;
        // Creamos la instancia correcta según el tipo guardado
        if (tipo === "guerrero") {
            personaje = new guerrero(datos.img, datos.nombre, datos.vida, datos.vida_max, datos.ataque, datos.tipo, datos.precio, datos.uso, datos.max_uso);
        }
        else if (tipo === "mago") {
            personaje = new mago(datos.img, datos.nombre, datos.vida, datos.vida_max, datos.ataque, datos.tipo, datos.precio, datos.uso, datos.max_uso);
        }
        else {
            personaje = new ladron(datos.img, datos.nombre, datos.vida, datos.vida_max, datos.ataque, datos.tipo, datos.precio, datos.uso, datos.max_uso);
        }
        // Copiamos cualquier propiedad extra que traiga el JSON
        Object.assign(personaje, datos);
        return personaje;
    });
}
