# ⚔️ Juego de Combate por Turnos en TypeScript

[![Jugar](https://img.shields.io/badge/Jugar-Demo-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://juego-con-typescript.onrender.com)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

Juego de navegador en el que contratas a un grupo de personajes (**guerreros, magos y ladrones**), los curas y te enfrentas a grupos controlados por la CPU. Cada jugador tiene su propia partida, que se guarda en su navegador.

> ▶️ **[Jugar ahora](https://juego-con-typescript.onrender.com)**. Al estar en el plan gratuito de Render, la primera carga puede tardar unos segundos.

## 💡 Sobre el proyecto

La base del juego la hicimos en clase en **JavaScript**, a partir de una idea de nuestro profesor. Después decidí **migrarlo entero a TypeScript** para aprender el **tipado estático**, algo que JavaScript no tiene: detectar errores antes de ejecutar el código y que quede más claro qué datos maneja cada función.

## ✨ Funcionalidades

- **Tienda de personajes:** contratas guerreros, magos y ladrones, cada uno con su vida, ataque y precio.
- **Combate por turnos** contra grupos generados por la CPU.
- **Curación** del grupo entre combates.
- **Pantallas de victoria y derrota.**
- **Guardar y cargar partida:** cada jugador tiene su propia partida guardada en su navegador.

## 🧠 Conceptos técnicos aplicados

- **TypeScript:** tipos en atributos, parámetros y retornos; *union types* (por ejemplo `type Seccion = "tienda" | "grupo" | "batalla" | "recuperacion"`) y un archivo de declaraciones `global.d.ts`.
- **Programación orientada a objetos:** una clase base `Personaje` y las clases `guerrero`, `mago` y `ladron` que heredan de ella con `extends`. También hay clases para `Combate` y `tienda`.
- **Persistencia en el navegador con JSON:**
  - `localStorage` para la **partida guardada**, que se mantiene aunque cierres el navegador.
  - `sessionStorage` para el **estado de la sesión actual** (partida y combate en curso).
  - `JSON.stringify` / `JSON.parse` para guardar los objetos y volver a cargarlos (rehidratarlos).
- **Asincronía:** uso de `fetch` y **promesas** (`.then` / `.catch`) para cargar dinámicamente las secciones HTML del juego (tienda, grupo, batalla) sin recargar la página.
- **Módulos ES** (`import` / `export`) para separar la lógica en archivos.

## 📁 Estructura

```
juego_con_typescript/
├── index.html          # Menú principal
├── html/               # Pantallas: juego, combate, contratar, información, victoria, derrota
├── script_ts/          # Código fuente en TypeScript
├── script/             # JavaScript compilado (lo genera tsc)
├── css/                # Estilos + Bootstrap
└── img/  gift/         # Sprites de personajes y animaciones
```

## 🚀 Ejecutarlo en local

```bash
git clone https://github.com/robertbrito1/juego_con_typescript.git
cd juego_con_typescript
npm install
npm run build      # compila script_ts/ → script/
```

Después sirve la carpeta con un servidor estático (por ejemplo la extensión *Live Server* de VS Code o `npx serve .`) y abre `index.html`.

> Mientras desarrollas, `npm run watch` recompila automáticamente al guardar.

## 👥 Autores

- **Robert Brito** · [@robertbrito1](https://github.com/robertbrito1)
- **Bruno Brito** · [@losbritos](https://github.com/losbritos)

Proyecto académico. Puedes usar y modificar el código citando a los autores; no está permitido su uso comercial.
