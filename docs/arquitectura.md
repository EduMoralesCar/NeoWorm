# Arquitectura de NeoWorm

## Filosofía

NeoWorm sigue una **arquitectura en capas** con separación clara entre el motor de juego (lógica de dominio) y la capa de presentación (React). El motor de juego es completamente independiente de React, lo que permite:

- Probar la lógica del juego sin necesidad de un navegador
- Reutilizar el motor con otros frameworks si fuera necesario
- Mantener el código del juego limpio de preocupaciones de UI

---

## Diagrama de Capas

```
┌──────────────────────────────────────────────────────────┐
│                   CAPA DE PRESENTACIÓN                    │
│                        (React)                            │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │   App    │  │   HUD    │  │PauseMenu │  │ThemePick │ │
│  └────┬─────┘  └──────────┘  └──────────┘  └──────────┘ │
│       │                                                  │
│  ┌────▼─────────────────────────────────────────────┐    │
│  │              GameCanvas (puente)                  │    │
│  │  - Monta canvas                                   │    │
│  │  - Crea InputHandler                              │    │
│  │  - Bucle rAF: update() + render() + drawGrid()    │    │
│  │  - Pasa input → Game                              │    │
│  └───────────────────────────────────────────────────┘    │
├──────────────────────────────────────────────────────────┤
│                  CAPA DE MOTOR (Canvas)                   │
│                                                          │
│  ┌──────────────┐  ┌──────────┐  ┌──────────────────┐   │
│  │     Game     │──│  Snake   │  │   themes.js       │   │
│  │  (orquestador)│  │  Food   │  │   10 paletas      │   │
│  └──────┬───────┘  └──────────┘  └──────────────────┘   │
│         │                                                │
│  ┌──────▼────────────────────────────────────────┐       │
│  │            Sistemas Base                       │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │       │
│  │  │  Canvas  │  │GameLoop  │  │InputHandler  │ │       │
│  │  │(abstrac.)│  │(rAF loop)│  │ (teclado)    │ │       │
│  │  └──────────┘  └──────────┘  └──────────────┘ │       │
│  └────────────────────────────────────────────────┘       │
└──────────────────────────────────────────────────────────┘
```

---

## Decisiones Técnicas

### 1. Canvas 2D nativo vs librería (PixiJS, Phaser)

**Decisión:** Canvas 2D nativo.

**Motivo:** Para un juego de tipo Snake, Canvas 2D ofrece rendimiento más que suficiente. Evitar dependencias pesadas mantiene el bundle pequeño (~65KB gzipped) y el código simple. Si en el futuro se necesitan efectos avanzados (partículas masivas, sprites animados), se podría migrar a PixiJS sin cambiar la arquitectura.

### 2. Fixed-timestep game loop

**Decisión:** Bucle con delta time acumulado y timestep fijo de 16.67ms (60 FPS).

**Motivo:** Garantiza que la simulación sea consistente independientemente de la tasa de refresco del monitor. El movimiento de la serpiente usa un temporizador acumulativo (`moveTimer`) que no depende del delta entre frames.

### 3. React para UI, no para el juego

**Decisión:** React gestiona menús, HUD y overlays. El canvas se maneja con imperativo JavaScript.

**Motivo:** React no está diseñado para bucles de 60 FPS con cientos de objetos renderizados. Mantener la lógica del juego fuera de React evita re-renders innecesarios y da control total sobre el pipeline de renderizado.

### 4. Grid fijo 20×15

**Decisión:** El área de juego tiene un tamaño lógico fijo de 20 columnas × 15 filas.

**Motivo:** Garantiza que la jugabilidad sea idéntica en cualquier pantalla y nivel de zoom. El `cellSize` se calcula dinámicamente para llenar el espacio disponible, y el área se centra con bordes negros.

### 5. Temas mediante paletas de datos, no CSS

**Decisión:** Los colores se definen en `themes.js` como objetos JavaScript y se pasan a los métodos `draw()`.

**Motivo:** Los temas afectan al renderizado del canvas, no a la UI de React. Mantenerlos como datos permite cambiarlos en caliente sin re-renders y facilita la adición de nuevos temas.

---

## Flujo de Datos Detallado

### Inicio del juego

```
1. Usuario hace clic en "Play"
2. App.handlePlay() → createGame()
3. createGame() → new Game({ gridCols, gridRows, themeIndex, callbacks })
4. Game instancia Snake (centro del grid) y Food (posición aleatoria)
5. setGameInstance(game) → GameCanvas recibe game
6. gameRef.current se actualiza
7. En el siguiente frame del bucle rAF:
   a. Se detecta que gameRef.current existe
   b. Se llama a game.update(clamped)
   c. Se llama a game.render(ctx, cellSize, ox, oy)
```

### Bucle de juego (cada frame)

```
requestAnimationFrame(timestamp)
  │
  ├─ Calcular deltaTime
  ├─ Leer input → game.setDirection(dir)
  ├─ game.update(dt)
  │    ├─ Acumular moveTimer
  │    ├─ Si moveTimer ≥ moveInterval:
  │    │    ├─ Snake.move()
  │    │    ├─ Detectar colisión con Food → grow() + spawn + score
  │    │    ├─ Detectar colisión con pared/self → game over
  │    │    └─ Si score % 50 == 0 → level up + tema + velocidad
  │    └─ (si está pausado o game over, no hace nada)
  │
  ├─ Canvas.clear() + fill()
  ├─ drawGrid() (solo si hay juego activo)
  ├─ drawBorder() (solo si hay juego activo)
  ├─ game.render(ctx, cellSize, ox, oy)
  │    ├─ Snake.draw() → recorre segmentos, dibuja cada uno con offset
  │    └─ Food.draw() → dibuja círculo con brillo
  │
  └─ requestAnimationFrame(loop)
```

### Pausa

```
Usuario hace clic en ⚙ (o presiona Escape)
  │
  ├─ handlePause()
  │    ├─ game.togglePause() → game.paused = true
  │    └─ pauseGame() → status = 'paused'
  │
  ├─ El bucle rAF sigue corriendo
  │    ├─ game.update() no hace nada (paused == true)
  │    └─ game.render() sigue dibujando (el juego se ve congelado)
  │
  └─ Se muestra <PauseMenu> (overlay React)
       ├─ Resume → handleResume() → game.togglePause() + resumeGame()
       ├─ Restart → createGame() + setGameInstance()
       └─ Exit → goToMenu()
```

---

## Patrones de Diseño Utilizados

| Patrón | Uso |
|--------|-----|
| **Game Loop** | Bucle fixed-timestep con acumulador (`GameLoop.js`) |
| **State Machine** | Estados del juego: menu → playing → paused → gameover (`useGameState.js`) |
| **Observer** | Callbacks `onScore`, `onLevelUp`, `onGameOver` desde Game a React |
| **Bridge** | GameCanvas conecta el mundo React con el motor de juego imperativo |
| **Module** | Cada archivo del motor exporta clases/funciones específicas |
| **Strategy** | Los temas definen colores que las entidades usan en su estrategia de dibujo |
