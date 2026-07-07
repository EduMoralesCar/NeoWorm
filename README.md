# 🐍 NeoWorm

**NeoWorm** es una reimaginación moderna del clásico juego Snake, construida con React y Canvas. Ofrece una experiencia de juego pulida con múltiples niveles, temas visuales dinámicos, power-ups y un sistema de progresión.

---

## ✨ Características

- **Jugabilidad clásica mejorada** — Controla una serpiente, come fruta, crece y evita chocar contra las paredes o tu propio cuerpo.
- **20×15 grid fijo** — El área de juego siempre tiene el mismo tamaño lógico, escala automáticamente a cualquier pantalla y zoom.
- **10 Temas visuales** — Paletas de colores únicas que cambian dinámicamente al subir de nivel. También puedes seleccionar tu tema favorito desde la pantalla de inicio.
- **Animaciones y detalles** — Partículas flotantes en el menú, ojos que parpadean, lengua bífida, escamas en el cuerpo y sombras glow.
- **Menú de pausa** — Pausa/reanuda con clic o tecla Escape. Opciones para reiniciar o salir.
- **HUD profesional** — Barra superior con puntuación, nivel y velocidad, más un botón de configuración.
- **Sistema de niveles** — Cada 50 puntos subes de nivel: la velocidad aumenta y el tema cambia.
- **Sonido (próximamente)** — Preparado para integración con Howler.js.

---

## 🛠 Stack Tecnológico

| Capa          | Tecnología                         |
|---------------|------------------------------------|
| Frontend      | React 19 + Vite                    |
| Renderizado   | Canvas 2D (vanilla JS)             |
| Estado        | useState / useReducer / custom hooks |
| Animaciones   | CSS keyframes + requestAnimationFrame |
| Sonido        | Howler.js (planeado)               |
| Persistencia  | LocalStorage / Supabase (planeado) |

---

## 📦 Instalación

```bash
git clone https://github.com/tuusuario/neoworm.git
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
| Gear (esquina) | Abrir menú de pausa  |

- **Come la fruta** (círculo rojo/color del tema) para crecer y sumar puntos.
- **Cada 50 puntos** subes de nivel: la velocidad aumenta y el tema cambia.
- **Si chocas** contra una pared o tu propio cuerpo, el juego termina.

---

## 🧱 Estructura del Proyecto

```
src/
├── game/                   # Motor de juego (canvas puro, sin React)
│   ├── engine/
│   │   ├── Canvas.js       # Abstracción del canvas (resize, HiDPI)
│   │   ├── GameLoop.js     # Bucle de tiempo fijo (requestAnimationFrame)
│   │   └── InputHandler.js # Teclado (flechas + WASD)
│   ├── entities/
│   │   ├── Snake.js        # Serpiente: segmentos, colisión, dibujo
│   │   └── Food.js         # Comida: spawn aleatorio, dibujo
│   ├── Game.js             # Orquestador: lógica principal, niveles, temas
│   ├── themes.js           # 10 paletas de colores
│   └── index.js            # Barrel export
├── components/             # Componentes React
│   ├── GameCanvas.jsx      # Canvas + loop + partículas menú
│   ├── HUD.jsx             # Barra superior (score, nivel, pausa)
│   ├── Layout.jsx          # Layout viewport completo
│   ├── PauseMenu.jsx       # Menú de pausa (resume, restart, exit)
│   └── ThemePicker.jsx     # Selector de temas en pantalla de inicio
├── hooks/
│   └── useGameState.js     # Máquina de estados (menu/playing/paused/gameover)
├── App.jsx                 # Punto de entrada, orquestación de pantallas
├── main.jsx                # Mount de React
└── index.css               # Estilos globales + keyframes animación
```

---

## 🏗 Arquitectura

El proyecto separa claramente el **motor de juego** (capa de rendering puro con Canvas) de la **capa de interfaz** (React). El motor no depende de React; los componentes React envuelven y controlan el motor.

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

### Diagrama de componentes

```
┌───────────┐     ┌──────────────┐     ┌──────────────┐
│   App     │────▶│  GameCanvas  │────▶│    Game      │
│ (estado)  │     │  (loop+input)│     │ (lógica)     │
└─────┬─────┘     └──────────────┘     └──────┬───────┘
      │                                       │
      ▼                                       ▼
┌───────────┐                        ┌──────────────┐
│  HUD      │                        │  Snake       │
│  PauseMenu│                        │  Food        │
│  ThemePick│                        │  themes.js   │
└───────────┘                        └──────────────┘
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
- [ ] Power-ups (escudo, velocidad, teletransporte)
- [ ] Enemigos IA
- [ ] Efectos de sonido (Howler.js)
- [ ] Logros y sistema de puntuación
- [ ] Skins de serpiente desbloqueables
- [ ] Modo multijugador local
- [ ] Leaderboard global (Supabase)
- [ ] Despliegue en Vercel/Render

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

MIT © 2026 — [Tu Nombre]

---

<div align="center">
  <sub>Hecho con ❤️ y 🐍</sub>
</div>
#   N e o W o r m  
 