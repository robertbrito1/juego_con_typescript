import { datos } from "./variables.js";







export function guardar(datosJuego:datos) {
    // 1. JSON.stringify convierte el objeto JavaScript completo (datosJuego) 
    //    en una cadena de texto JSON.
    const datosSerializados = JSON.stringify(datosJuego);

    // 2. Guardamos la cadena JSON en localStorage bajo una clave específica.
    localStorage.setItem('partidaGuardada', datosSerializados);
    

    return datosSerializados;
}

export function cargar_datos() {
    const partidaSerializada = localStorage.getItem('partidaGuardada');
// Antes de hacer cualquier cosa, eliminamos posibles modales anteriores para evitar duplicados
    ['modal_sin_datos', 'modalCargar'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.remove();
    });

    // --- ESCENARIO A: NO HAY PARTIDA ---
    if (!partidaSerializada || partidaSerializada === 'undefined' || partidaSerializada === '') {
        const modalSinDatosHTML = `
            <div class="modal fade" id="modal_sin_datos" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content bg-dark text-white border-primary border-2">
                        <div class="modal-header border-0 pb-0">
                            <h5 class="modal-title fw-bold text-uppercase text-primary">Aviso del Sistema</h5>
                        </div>
                        <div class="modal-body text-center py-4">
                            <h3 class="mb-3">No tienes una partida guardada</h3>
                            <p class="text-secondary">Debes iniciar una nueva aventura para poder guardar progresos.</p>
                        </div>
                        <div class="modal-footer border-0 justify-content-center">
                            <button type="button" class="btn btn-primary px-4" data-bs-dismiss="modal">ENTENDIDO</button>
                        </div>
                    </div>
                </div>
            </div>`;
            // Insertamos el modal en el DOM y lo mostramos
        document.body.insertAdjacentHTML('beforeend', modalSinDatosHTML);
        // Usamos Bootstrap para mostrar el modal
        const modalSinDatos = document.getElementById('modal_sin_datos');
        if (modalSinDatos) {
            new bootstrap.Modal(modalSinDatos).show();
        }
        return; 
    }

    // --- ESCENARIO B: HAY PARTIDA GUARDADA ---
    const datos = JSON.parse(partidaSerializada);
    
    const modalCargarHTML = `
        <div class="modal fade" id="modalCargar" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content bg-dark text-white border-primary border-2">
                    <div class="modal-header border-0 pb-0">
                        <h5 class="modal-title fw-bold text-primary text-uppercase">Partida Encontrada</h5>
                    </div>
                    <div class="modal-body text-center">
                        <div class="p-3 bg-black bg-opacity-50 rounded border border-secondary mb-3 text-start">
                            <p class="m-0">💰 Monedas: <b>${datos.dinero}</b></p>
                            <p class="m-0">🛡️ Personajes: <b>${datos.mi_grupo ? datos.mi_grupo.length : 0}</b></p>
                            <p class="m-0">🏆 Victorias: <b>${datos.contador_victoria_jugador || 0}</b></p>
                            <p class="m-0">💀 Derrotas: <b>${datos.contador_victoria_cpu || 0}</b></p>
                        </div>
                        <p>¿Deseas continuar con tu aventura?</p>
                    </div>
                    <div class="modal-footer border-0 d-flex justify-content-center gap-3">
                        <button type="button" class="btn btn-outline-light px-4" data-bs-dismiss="modal">CANCELAR</button>
                        <button type="button" class="btn btn-primary px-4 fw-bold" id="btnConfirmarCarga">CARGAR PARTIDA</button>
                    </div>
                </div>
            </div>
        </div>`;
// Insertamos el modal en el DOM y lo mostramos
    document.body.insertAdjacentHTML('beforeend', modalCargarHTML);
    // Configuramos el modal para que no se cierre al hacer clic fuera de él o al presionar la tecla Esc
    const modalElemento = document.getElementById('modalCargar');
    if (!modalElemento) return;

    const instanciaModal = new bootstrap.Modal(modalElemento, {
        backdrop: 'static',
        keyboard: false
    });
    
    instanciaModal.show();

    // Evento de carga real: usamos onclick para asegurar que no se dupliquen listeners
    const btnConfirmarCarga = document.getElementById('btnConfirmarCarga') as HTMLButtonElement | null;
    if (!btnConfirmarCarga) return;

    btnConfirmarCarga.onclick = () => {
        // Guardamos en sessionStorage para que la pantalla de juego lo lea
        sessionStorage.setItem("partida_actual", JSON.stringify(datos));
        
        // Efecto visual opcional antes de redirigir
        btnConfirmarCarga.disabled = true;
        btnConfirmarCarga.innerHTML = "CARGANDO...";
        
        window.location.href = "/html/juego.html";
    };
}