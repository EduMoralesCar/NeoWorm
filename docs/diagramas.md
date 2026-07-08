# Diagramas de NeoWorm

Todos los diagramas están escritos en sintaxis **Mermaid** y se renderizan automáticamente en editores compatibles (GitHub, VS Code con extensión Mermaid, etc.).

---

## 1. Diagrama de Casos de Uso

```mermaid
graph TD
    Jugador((Jugador))
    
    Jugador -->|Jugar| IniciarPartida[Iniciar Partida]
    Jugador -->|Seleccionar| ElegirTema[Elegir Tema Visual]
    Jugador -->|Mover| MoverSerpiente[Mover Serpiente]
    Jugador -->|Comer| ComerFruta[Comer Fruta]
    Jugador -->|Pausar| PausarJuego[Pausar Juego]
    Jugador -->|Reanudar| ReanudarJuego[Reanudar Juego]
    Jugador -->|Reiniciar| ReiniciarPartida[Reiniciar Partida]
    Jugador -->|Salir| SalirAlMenu[Salir al Menú]
    
    IniciarPartida -->|incluye| CrearPartidaNueva[Crear Partida Nueva]
    MoverSerpiente -->|extiende| Colisionar[Colisionar con Pared/Cuerpo]
    ComerFruta -->|extiende| Crecer[Crecimiento + Puntuación]
    ComerFruta -->|extiende| SubirNivel[Subir de Nivel]
    SubirNivel -->|extiende| CambiarTema[Cambiar Tema Visual]
    SubirNivel -->|extiende| AumentarVelocidad[Aumentar Velocidad]
```

---

## 2. Diagrama de Componentes

```mermaid
graph TB
    subgraph "Capa React UI"
        App[App.jsx]
        HUD[HUD.jsx]
        PM[PauseMenu.jsx]
        TP[ThemePicker.jsx]
        L[Layout.jsx]
    end
    
    subgraph "Puente"
        GC[GameCanvas.jsx]
    end
    
    subgraph "Capa Motor"
        G[Game.js]
        S[Snake.js]
        F[Food.js]
        T[themes.js]
        subgraph "Sistemas Base"
            C[Canvas.js]
            GL[GameLoop.js]
            IH[InputHandler.js]
        end
    end
    
    App --> GC
    App --> HUD
    App --> PM
    App --> TP
    App --> L
    
    GC --> C
    GC --> IH
    GC --> G
    
    G --> S
    G --> F
    G --> T
    
    L --> GC
```

---

## 3. Diagrama de Flujo del Juego

```mermaid
stateDiagram-v2
    [*] --> Menu
    
    Menu --> Playing: Click "Play"
    Menu --> Playing: Click "Play Again"
    
    Playing --> Paused: Click ⚙ / Escape
    Playing --> GameOver: Colisión
    
    Paused --> Playing: Click "Resume" / Escape
    Paused --> Playing: Click "Restart"
    Paused --> Menu: Click "Exit"
    
    GameOver --> Playing: Click "Play Again"
    GameOver --> Menu: Click "Menu"
    
    Playing --> Playing: Comer fruta → +10 puntos
    Playing --> Playing: 50 puntos → Level Up + Tema + Velocidad
```

---

## 4. Diagrama de Secuencia — Inicio de Partida

```mermaid
sequenceDiagram
    actor J as Jugador
    participant App as App.jsx
    participant GC as GameCanvas
    participant G as Game
    participant S as Snake
    participant F as Food
    
    J->>App: Click "Play"
    App->>App: createGame()
    App->>G: new Game({gridCols, gridRows, themeIndex})
    G->>S: new Snake(centroX, centroY)
    G->>F: new Food()
    F->>F: spawn(gridCols, gridRows, isOccupied)
    App->>GC: render(game)
    Note over GC: gameRef.current = game
    
    loop Cada frame (60 FPS)
        GC->>GC: canvas.clear()
        GC->>GC: drawGrid() + drawBorder()
        GC->>G: game.update(dt)
        G->>S: snake.move()
        S-->>G: nueva posición
        G->>F: ¿colisión con food?
        F-->>G: sí/no
        G->>GC: game.render(ctx, cellSize, ox, oy)
        GC->>S: snake.draw()
        GC->>F: food.draw()
    end
```

---

## 5. Diagrama de Secuencia — Colisión y Game Over

```mermaid
sequenceDiagram
    participant GC as GameCanvas
    participant G as Game
    participant S as Snake
    participant App as App.jsx
    
    loop Cada tick de movimiento
        G->>S: snake.move(gridCols, gridRows)
        S-->>G: nueva posición del head
        G->>S: checkWallCollision()
        G->>S: checkSelfCollision()
        
        alt Colisión detectada
            S-->>G: true
            G->>G: isOver = true
            G->>App: onGameOver()
            App->>App: status = 'gameover'
            Note over GC: Bucle sigue, render() sigue mostrando la serpiente
            App-->>Jugador: Muestra overlay "Game Over"
        else Sin colisión
            S-->>G: false
            Note over G: Continúa jugando
        end
    end
```

---

## 6. Diagrama de Flujo de Datos — Renderizado

```mermaid
flowchart LR
    subgraph "Por frame"
        A[Canvas.clear] --> B[Fondo negro]
        B --> C{¿Hay juego?}
        C -->|No| D[Partículas menú]
        C -->|Sí| E[Fondo del tema]
        E --> F[Dibujar grid]
        F --> G[Dibujar borde]
        G --> H[game.render]
        H --> I[Snake.draw + offset]
        H --> J[Food.draw + offset]
    end
    
    subgraph "Datos de entrada"
        K[InputHandler.teclas] --> L{¿Juego activo?}
        L -->|Sí| M[game.setDirection]
        M --> N[game.update]
        N --> H
    end
```

---

## 7. Diagrama de Despliegue (futuro)

```mermaid
graph TB
    subgraph "Cliente (Navegador)"
        A[Static Files: HTML/CSS/JS]
        B[Canvas 2D Renderer]
        C[React UI]
        D[LocalStorage]
    end
    
    subgraph "Servidor (planeado)"
        E[Supabase / Render]
        F[Leaderboard API]
        G[Autenticación]
    end
    
    A --> B
    A --> C
    C --> D
    C -.->|HTTP| E
    E --> F
    E --> G
    
    style A fill:#1a1a2e,stroke:#0f0
    style B fill:#16213e,stroke:#0f0
    style C fill:#0f3460,stroke:#0f0
```

---

## 8. Diagrama de Temas (mapeo nivel → tema)

```mermaid
graph LR
    subgraph "Niveles 1-10"
        L1[Level 1] --> T1[Classic]
        L2[Level 2] --> T2[Neon City]
        L3[Level 3] --> T3[Toxic Swamp]
        L4[Level 4] --> T4[Deep Space]
        L5[Level 5] --> T5[Lava Core]
        L6[Level 6] --> T6[Arctic Frost]
        L7[Level 7] --> T7[Sunset Drive]
        L8[Level 8] --> T8[Midnight Purple]
        L9[Level 9] --> T9[Golden Sands]
        L10[Level 10] --> T10[Ocean Depths]
    end
    
    L1 -.->|Si se eligió tema| TemaElegido[Theme elegido por el usuario]
    
    style T1 fill:#0a0a0a,stroke:#0f0
    style T2 fill:#0a0015,stroke:#0ff
    style T3 fill:#0a1005,stroke:#af0
    style T4 fill:#050510,stroke:#a4f
    style T5 fill:#100500,stroke:#f40
    style T6 fill:#0a1018,stroke:#8df
    style T7 fill:#120a08,stroke:#f84
    style T8 fill:#080012,stroke:#c8f
    style T9 fill:#0e0c06,stroke:#fc3
    style T10 fill:#040e12,stroke:#0da
```
