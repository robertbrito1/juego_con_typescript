import { Personaje } from "./personajes";

export class datos{
    dinero :number;
    intento :number;
    grupo_cpu :Personaje[];
    mi_grupo :Personaje[];
    se_recupera :boolean;
    contador_victoria_cpu :number;
    contador_victoria_jugador :number;
    dificultad :string;
    constructor(dinero:number,intento:number,grupo_cpu:Personaje[],mi_grupo:Personaje[],se_recupera:boolean,contador_victoria_cpu:number,contador_victoria_jugador:number,dificultad:string){
        
        this.dinero=dinero;
        this.intento=intento;
        this.grupo_cpu=grupo_cpu;
        this.mi_grupo=mi_grupo;
        this.se_recupera=se_recupera;
        this.contador_victoria_cpu=contador_victoria_cpu;
        this.contador_victoria_jugador=contador_victoria_jugador;
        this.dificultad=dificultad;

    }
    toString() {
        // La cadena resultante incluirá el salto de línea inicial y la indentación de los espacios
        return `
            --- Estado del Juego ---
            Dinero: ${this.dinero}
            Intentos Tienda: ${this.intento}
            Victorias Jugador: ${this.contador_victoria_jugador}
            Victorias CPU: ${this.contador_victoria_cpu}
            Recuperación disponible: ${this.se_recupera ? 'Sí' : 'No'}
            Miembros del Grupo: ${this.mi_grupo.length}
            Miembros CPU: ${this.grupo_cpu.length}
            
            ----------------------
        `;
    }
}