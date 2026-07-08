<div align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Canvas-2D-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="Canvas 2D" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</div>

<h1 align="center">🐍 NeoWorm</h1>

<p align="center">
  Reimaginación moderna del clásico Snake con Canvas 2D, temas dinámicos y sistema de niveles.
</p>

<div align="center">
  <h3>
    <a href="https://neoworm.vercel.app/">🚀 VER APLICACIÓN EN VIVO (VERCEL)</a>
  </h3>
</div>

---

## 🌟 Sobre el Proyecto

**NeoWorm** es una versión moderna y pulida del clásico juego Snake, construida con **React 19** y **Canvas 2D**. El motor de juego está separado de la capa de UI de React, permitiendo un rendering eficiente sin dependencias cruzadas. Ofrece 10 temas visuales únicos, animaciones detalladas (ojos que parpadean, lengua bífida, escamas, partículas flotantes) y un sistema de progresión por niveles que acelera la partida y cambia la estética del juego dinámicamente.

---

## ✨ Mapeo Visual de Funcionalidades

### 🎮 1. Jugabilidad Clásica Mejorada
- **Grid fijo 20×15:** Área de juego consistente en cualquier pantalla. Las celdas se escalan automáticamente con el tamaño de la ventana y el zoom del navegador.
- **Control preciso:** Teclas de dirección (← → ↑ ↓) y WASD. La serpiente se mueve con un temporizador de paso fijo que se acelera al subir de nivel.
- **Detección de colisiones:** Choque contra paredes (límites del grid) o contra el propio cuerpo de la serpiente — game over inmediato.

### 🎨 2. Temas Visuales Dinámicos
- **10 paletas de colores** creadas manualmente con combinaciones únicas de fondo, cuadrícula, serpiente y comida.
- **Cambio automático por nivel:** Cada 50 puntos subes de nivel y el tema cambia automáticamente.
- **Selector en pantalla de inicio:** El jugador puede elegir su tema favorito antes de comenzar.

### 🐍 3. Animaciones y Detalles Visuales
- **Serpiente con personalidad:** Cabeza redondeada con ojos que parpadean (animación cada 3 segundos), lengua bífida animada al moverse, cuerpo con efecto de escamas.
- **Partículas en el menú:** 60 puntos verdes flotantes con movimiento browniano sobre un fondo animado con gradiente (`gradient-shift`).
- **Efectos glow:** Sombra brillante en el título (`pulse-glow`), botón pulsante (`pulse-button`) y borde sutil del área de juego.

### ⏸ 4. Menú de Pausa
- Pausa/reanuda con clic en el botón de pausa del HUD o con la tecla **Escape**.
- Opciones: **Reanudar**, **Reiniciar** (vuelve al mismo tema) y **Salir** (regresa al menú principal).
- El estado de pausa congela completamente el juego (no se procesan inputs ni updates).

### 📊 5. HUD Profesional
- Barra superior con: **Puntuación**, **Nivel actual**, **Velocidad** (multiplicador).
- Botón de pausa (icono "II") en la esquina superior derecha.

---

## 🛠️ Tecnologías Utilizadas

| Capa          | Tecnología                          |
|---------------|-------------------------------------|
| Frontend      | React 19 + Vite                     |
| Renderizado   | Canvas 2D API (vanilla JS)          |
| Estado        | useState / useReducer / custom hooks|
| Animaciones   | CSS keyframes + requestAnimationFrame |
| Despliegue    | Vercel                              |

---

## 🚀 Despliegue Local

```bash
git clone https://github.com/EduMoralesCar/NeoWorm.git
cd neoworm
npm install
npm run dev
```

El servidor de desarrollo se abrirá en `http://localhost:5173`.

### Comandos disponibles

| Comando           | Descripción                               |
|-------------------|-------------------------------------------|
| `npm run dev`     | Inicia el servidor de desarrollo          |
| `npm run build`   | Compila para producción en `dist/`        |
| `npm run preview` | Previsualiza la build de producción       |
| `npm run lint`    | Ejecuta el linter (Oxlint)                |

---

## 🎮 Cómo Jugar

| Tecla          | Acción              |
|----------------|---------------------|
| ← → ↑ ↓       | Mover la serpiente  |
| W A S D        | Mover (alternativo) |
| Escape         | Pausar / Reanudar   |

- **Come la fruta** para crecer y sumar **10 puntos**.
- **Cada 50 puntos** subes de nivel: la velocidad aumenta y el tema cambia.
- **Si chocas** contra una pared o tu propio cuerpo, el juego termina.

---

## 🧱 Estructura del Proyecto

```
src/
├── game/                       # Motor de juego (canvas puro, sin React)
│   ├── engine/
│   │   ├── Canvas.js           # Abstracción del canvas (resize, HiDPI)
│   │   ├── GameLoop.js         # Bucle de tiempo fijo (requestAnimationFrame)
│   │   └── InputHandler.js     # Teclado (flechas + WASD)
│   ├── entities/
│   │   ├── Snake.js            # Serpiente: segmentos, colisión, dibujo
│   │   └── Food.js             # Comida: spawn aleatorio, dibujo
│   ├── Game.js                 # Orquestador: lógica principal, niveles, temas
│   ├── themes.js               # 10 paletas de colores
│   └── index.js                # Barrel export
├── components/                 # Componentes React
│   ├── GameCanvas.jsx          # Canvas + loop + partículas menú
│   ├── HUD.jsx                 # Barra superior (score, nivel, pausa)
│   ├── Layout.jsx              # Layout viewport completo
│   ├── PauseMenu.jsx           # Menú de pausa (resume, restart, exit)
│   └── ThemePicker.jsx         # Selector de temas en pantalla de inicio
├── hooks/
│   └── useGameState.js         # Máquina de estados (menu/playing/paused/gameover)
├── App.jsx                     # Punto de entrada, orquestación de pantallas
├── main.jsx                    # Mount de React
└── index.css                   # Estilos globales + keyframes animación
```

---

## 🏗 Arquitectura

El proyecto separa claramente el **motor de juego** (capa de rendering puro con Canvas 2D) de la **capa de interfaz** (React). El motor no depende de React; los componentes React envuelven y controlan el motor a través de `GameCanvas`, que actúa como puente.

```
┌─────────────────────────────────────────────────┐
│  React UI Layer                                 │
│  (App, HUD, PauseMenu, ThemePicker)             │
├─────────────────────────────────────────────────┤
│  GameCanvas (puente React ↔ Canvas)             │
│  - Crea Canvas, InputHandler                    │
│  - Bucle rAF: update() + render()               │
│  - Pasa input al Game                           │
├─────────────────────────────────────────────────┤
│  Game Engine (sin dependencias React)           │
│  Game → Snake + Food + themes                   │
│  GameLoop → fixed timestep                      │
│  InputHandler → keyboard events                 │
└─────────────────────────────────────────────────┘
```

### Flujo de datos

```
Usuario presiona tecla
       ↓
InputHandler (keydown) → dirección
       ↓
GameCanvas (rAF loop) → game.setDirection(dir)
       ↓
Game.update(dt) → Snake.move()
                → detecta colisión con Food
                → detecta colisión con pared/self
       ↓
Game.render(ctx, cellSize, ox, oy) → Snake.draw()
                                    → Food.draw()
       ↓
Canvas 2D (píxeles en pantalla)
```

---

## 📚 Documentación

La documentación completa del proyecto se encuentra en la carpeta [`docs/`](./docs/):

| Documento                 | Descripción                                   |
|---------------------------|-----------------------------------------------|
| [Estructura](./docs/estructura.md)      | Árbol completo del proyecto y responsabilidades |
| [Arquitectura](./docs/arquitectura.md)  | Decisiones técnicas, patrones, flujo de datos |
| [CMMI](./docs/cmmi.md)                 | Proceso de desarrollo basado en CMMI          |
| [Diagramas](./docs/diagramas.md)        | Diagramas de flujo, componentes, secuencia    |
| [Guía de Desarrollo](./docs/guia-desarrollo.md) | Convenciones, estándares, cómo contribuir |

---

## 🧪 Pruebas

*(Próximamente)* Se integrarán pruebas unitarias con Vitest para el motor de juego y pruebas de componentes con React Testing Library.

```bash
npm test              # Próximamente
npm run test:coverage # Próximamente
```

---

## 🚀 Roadmap

- [x] MVP: mecánica básica de Snake en Canvas
- [x] Integración React: menús, HUD
- [x] Sistema de niveles y temas visuales
- [x] Animaciones: partículas, ojos, lengua, escamas
- [x] Grid fijo 20×15 con escalado responsive
- [ ] Power-ups (escudo, velocidad, teletransporte)
- [ ] Enemigos IA
- [ ] Efectos de sonido (Howler.js)
- [ ] Logros y sistema de puntuación
- [ ] Skins de serpiente desbloqueables
- [ ] Modo multijugador local
- [ ] Leaderboard global (Supabase)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, revisa la [Guía de Desarrollo](./docs/guia-desarrollo.md) antes de comenzar.

1. Haz fork del repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Haz commit de tus cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT © 2026 — EduMoralesCar

---

<div align="center">
  <sub>Hecho con ❤️ y 🐍</sub>
</div>
