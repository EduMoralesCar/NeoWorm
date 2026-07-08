# Estructura del Proyecto

## Árbol completo

```
game/
├── public/
│   └── favicon.svg               # Icono de la aplicación (cabeza de worm)
│
├── src/
│   ├── game/                     # ★ Motor de juego (independiente de React)
│   │   ├── engine/               #   Sistemas base del motor
│   │   │   ├── Canvas.js         #     Abstracción del elemento <canvas>
│   │   │   ├── GameLoop.js       #     Bucle fixed-timestep (rAF)
│   │   │   └── InputHandler.js   #     Captura de teclado (flechas + WASD)
│   │   ├── entities/             #   Entidades del juego
│   │   │   ├── Snake.js          #     Serpiente: segmentos, dirección, colisiones, dibujo animado
│   │   │   └── Food.js           #     Comida: spawn aleatorio, dibujo con brillo
│   │   ├── Game.js               #   Orquestador principal del juego
│   │   ├── themes.js             #   10 paletas de colores para niveles
│   │   └── index.js              #   Barrel export público
│   │
│   ├── components/               # ★ Componentes React (UI)
│   │   ├── GameCanvas.jsx        #   Componente puente: monta canvas + input + bucle
│   │   ├── HUD.jsx               #   Barra superior: Score, Level, Speed, botón pausa
│   │   ├── Layout.jsx            #   Contenedor viewport completo (flex column)
│   │   ├── PauseMenu.jsx         #   Overlay de pausa: Resume, Restart, Exit
│   │   └── ThemePicker.jsx       #   Selector de tema visual en menú principal
│   │
│   ├── hooks/                    # ★ Hooks personalizados React
│   │   └── useGameState.js       #   Máquina de estados: menu → playing → paused → gameover
│   │
│   ├── App.jsx                   # Punto de entrada de la aplicación React
│   ├── main.jsx                  # Mount de React en el DOM
│   ├── index.css                 # Estilos globales + keyframes de animación
│   └── App.css                   # (reservado)
│
├── docs/                         # ★ Documentación del proyecto
│   ├── README.md                 #   Índice de documentación
│   ├── estructura.md             #   Este archivo
│   ├── arquitectura.md           #   Arquitectura y decisiones técnicas
│   ├── cmmi.md                   #   Proceso CMMI
│   ├── diagramas.md              #   Diagramas UML/Mermaid
│   └── guia-desarrollo.md        #   Guía para contribuir
│
├── index.html                    # HTML principal
├── package.json                  # Dependencias y scripts
├── vite.config.js                # Configuración de Vite
├── .gitignore
├── .oxlintrc.json                # Configuración del linter
└── README.md                     # README principal del proyecto
```

## Responsabilidades por capa

### `src/game/` — Motor de juego (capa de dominio)

No tiene dependencias de React, DOM ni librerías externas. Es puramente lógica de juego y rendering con Canvas 2D.

| Módulo | Responsabilidad |
|--------|-----------------|
| `engine/Canvas.js` | Envolver el elemento canvas, manejar resize con HiDPI (`devicePixelRatio`), limpiar el área de dibujo |
| `engine/GameLoop.js` | Bucle de tiempo fijo con `requestAnimationFrame`, acumulador para delta time consistente |
| `engine/InputHandler.js` | Escuchar eventos `keydown`/`keyup`, exponer estado actual de teclas y detección de "apenas presionado" |
| `entities/Snake.js` | Array de segmentos, movimiento direccional, crecimiento, colisión contra sí misma y paredes, dibujo con ojos/parpadeo/lengua/escamas |
| `entities/Food.js` | Posición única, spawn aleatorio evitando la serpiente, dibujo con brillo y reflejo |
| `Game.js` | Coordina Snake + Food, gestiona puntuación/niveles/temas/velocidad, expone `update(dt)` y `render(ctx, cellSize, ox, oy)` |
| `themes.js` | 10 paletas de color, función `getTheme(level)` que wrappea con módulo |

### `src/components/` — Capa de interfaz (React)

Cada componente tiene una responsabilidad específica dentro de la UI.

| Componente | Responsabilidad |
|------------|-----------------|
| `GameCanvas` | Crear y montar el canvas, instanciar el motor (Canvas + InputHandler), ejecutar el bucle rAF, renderizar partículas en menú, dibujar borde del área de juego |
| `HUD` | Barra superior fija con puntuación, nivel, velocidad y botón de pausa |
| `Layout` | Contenedor flex que ocupa el 100% del viewport |
| `PauseMenu` | Overlay modal con opciones Resume, Restart y Exit |
| `ThemePicker` | Parrilla de tarjetas para seleccionar tema visual en la pantalla de inicio |

### `src/hooks/` — Lógica de estado reutilizable

| Hook | Responsabilidad |
|------|-----------------|
| `useGameState` | Máquina de estados simple: `menu → playing → paused → gameover`. Expone acciones `startGame`, `pauseGame`, `resumeGame`, `gameOver`, `goToMenu` |

## Flujo de archivos en tiempo de ejecución

```
index.html
  └─ src/main.jsx
       └─ src/App.jsx
            ├─ src/components/Layout.jsx
            ├─ src/components/HUD.jsx
            ├─ src/components/GameCanvas.jsx
            │    └─ src/game/engine/Canvas.js
            │    └─ src/game/engine/InputHandler.js
            │    └─ src/game/Game.js
            │         ├─ src/game/entities/Snake.js
            │         └─ src/game/entities/Food.js
            │         └─ src/game/themes.js
            ├─ src/components/PauseMenu.jsx
            └─ src/components/ThemePicker.jsx
                 └─ src/game/themes.js
```
