# Guía de Desarrollo

## Convenciones de Código

### Generales

- **Idioma**: Código fuente en **inglés** (variables, funciones, clases). Documentación y comentarios en **español**.
- **Estilo**: Se prefiere claridad sobre brevedad. Nombres descriptivos.
- **Formato**: El linter (Oxlint) se encarga de la consistencia.

### JavaScript

- Usar `export class` y `export function` en lugar de `export default` cuando haya múltiples exportaciones.
- Componentes React: usar `export default function Componente()`.
- Funciones flecha para callbacks y métodos de clase cortos.
- `const` por defecto, `let` cuando sea necesario reasignar. Evitar `var`.

### Nomenclatura

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Clases | PascalCase | `class Snake`, `class GameLoop` |
| Funciones | camelCase | `function setDirection()`, `togglePause()` |
| Variables | camelCase | `const moveInterval`, `let gridSize` |
| Constantes | UPPER_SNAKE_CASE | `const GRID_SIZE = 32` |
| Archivos JS | PascalCase para clases, camelCase para utilidades | `Snake.js`, `inputHandler.js` |
| Archivos JSX | PascalCase | `GameCanvas.jsx`, `HUD.jsx` |
| CSS | camelCase (objetos estilo inline) | `buttonSecondary`, `scoreText` |
| Privado | Prefijo `#` (private class fields) | `#drawEyes()`, `#drawTongue()` |

### Commits

- Usar mensajes descriptivos en **español**.
- Formato: `verbo: descripción breve`
- Ejemplos:
  - `agrega: sistema de temas visuales con 10 paletas`
  - `corrige: tema seleccionado no se aplicaba al iniciar juego`
  - `mejora: diseño de la serpiente con ojos y lengua`

---

## Flujo de Trabajo Git

### Rama principal

- `main` — Código estable y funcional. Siempre debe compilar sin errores.

### Proceso

```
1. Asegurarse de estar en main:  git checkout main
2. Crear rama:                    git checkout -b feature/nombre-funcionalidad
3. Hacer cambios y commits:       git commit -m "agrega: nueva funcionalidad"
4. Compilar y verificar:          npm run build
5. Volver a main:                 git checkout main
6. Fusionar:                      git merge feature/nombre-funcionalidad
7. Eliminar rama:                 git branch -d feature/nombre-funcionalidad
```

---

## Cómo Contribuir

### Requisitos previos

- Node.js v18+
- npm v9+

### Pasos

1. Haz fork del repositorio
2. Clona tu fork: `git clone https://github.com/tuusuario/neoworm.git`
3. Instala dependencias: `npm install`
4. Crea una rama para tu cambio
5. Implementa el cambio
6. Verifica que compile: `npm run build`
7. Haz commit y push
8. Abre un Pull Request describiendo el cambio

### Qué puedes hacer

- **Reportar bugs** — Si encuentras un error, abre un Issue describiendo:
  - Qué esperabas que pasara
  - Qué pasó realmente
  - Cómo reproducirlo
- **Sugerir funcionalidades** — Abre un Issue con la etiqueta "enhancement"
- **Contribuir código** — Sigue el flujo de trabajo Git descrito arriba

---

## Estándares de Calidad

### Antes de hacer commit

- [ ] El proyecto compila sin errores (`npm run build`)
- [ ] No hay errores de linter (Oxlint)
- [ ] La funcionalidad nueva está documentada (si aplica)
- [ ] Los nombres de variables y funciones son descriptivos
- [ ] No hay código comentado sin usar

### Durante la revisión de código

- [ ] ¿El cambio sigue la arquitectura de capas?
- [ ] ¿Las nuevas dependencias son necesarias?
- [ ] ¿El rendimiento del canvas se ve afectado?
- [ ] ¿Los temas visuales se renderizan correctamente?

---

## Entorno de Desarrollo

### Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con HMR en `localhost:5173` |
| `npm run build` | Compilación para producción en `dist/` |
| `npm run preview` | Vista previa de la build de producción |
| `npm run lint` | Ejecutar linter |

### Estructura de archivos recomendada para nuevas funcionalidades

```
src/game/
  ├── entities/
  │   └── NuevoEntity.js    # Nueva entidad del juego
  ├── systems/
  │   └── NuevoSystem.js    # Nuevo sistema (colisiones, power-ups, etc.)
  └── Game.js               # Integrar nuevo entity/system

src/components/
  └── NuevoComponente.jsx   # Nuevo componente React

src/hooks/
  └── useNuevoHook.js       # Nuevo hook
```

### Depuración

- Usa `console.log` en el bucle de juego para ver valores de estado
- El canvas se puede inspeccionar con las DevTools del navegador
- Para depurar el renderizado, pausa el bucle con `debugger` en el loop
