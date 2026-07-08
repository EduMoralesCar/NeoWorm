# Proceso de Desarrollo basado en CMMI

## ¿Qué es CMMI?

**CMMI** (Capability Maturity Model Integration) es un modelo de madurez para el desarrollo de software que define prácticas clave organizadas en áreas de proceso. NeoWorm aplica principios de CMMI de forma ágil y adaptada al tamaño del proyecto, buscando un **nivel de madurez 2 (Gestionado)** como objetivo.

---

## Áreas de Proceso Implementadas

### 1. Gestión de Requisitos (REQM)

| Práctica | Implementación |
|----------|----------------|
| Obtener entendimiento de los requisitos | El archivo de diseño (`README.md` sección Roadmap) define las funcionalidades esperadas |
| Obtener compromiso con los requisitos | Cada funcionalidad se discute y acuerda con el stakeholder (tú) antes de implementar |
| Gestionar cambios de requisitos | Los cambios se documentan en las conversaciones y se reflejan en el código |
| Mantener trazabilidad bidireccional | Cada función implementada se corresponde con un ítem del Roadmap |

### 2. Planificación de Proyecto (PP)

| Práctica | Implementación |
|----------|----------------|
| Establecer estimaciones | Uso de `todowrite` para estimar y desglosar tareas antes de empezar |
| Desarrollar un plan de proyecto | Roadmap en README con hitos priorizados (MVP → React → Niveles → Power-ups → Polaco → Deploy) |
| Obtener compromiso con el plan | Cada sprint se acuerda contigo antes de empezar |

### 3. Seguimiento y Control del Proyecto (PMC)

| Práctica | Implementación |
|----------|----------------|
| Monitorizar el progreso | Uso de la herramienta `todowrite` para tracking en tiempo real |
| Gestionar acciones correctivas | Si algo no funciona (ej: tema no se aplica), se identifica y corrige inmediatamente |
| Gestionar compromisos | Los entregables se verifican con `npm run build` antes de darlos por completados |

### 4. Gestión de Configuración (CM)

| Práctica | Implementación |
|----------|----------------|
| Identificar ítems de configuración | Código fuente, documentación, assets (favicon), configuraciones (vite.config, oxlint) |
| Establecer un sistema de gestión de configuración | Git como VCS, commits atómicos por funcionalidad |
| Gestionar cambios | Cada cambio se prueba con build antes de confirmar |

### 5. Aseguramiento de la Calidad (PPQA)

| Práctica | Implementación |
|----------|----------------|
| Evaluar objetivamente los procesos | `npm run build` como gate de calidad |
| Evaluar la calidad del producto | Linter (Oxlint) configurado en `.oxlintrc.json` |
| Registrar y resolver no-conformidades | Los bugs detectados se corrigen en el mismo ciclo |

### 6. Gestión de Riesgos (RSKM)

| Práctica | Implementación |
|----------|----------------|
| Identificar riesgos | Riesgos conocidos: rendimiento del canvas, compatibilidad de navegadores, escalado de grid |
| Analizar y priorizar riesgos | El grid fijo 20×15 elimina el riesgo de escalado inconsistente |
| Desarrollar planes de mitigación | Separación de capas permite cambiar el motor sin afectar UI |

---

## Ciclo de Desarrollo

NeoWorm sigue un ciclo iterativo inspirado en Scrum + CMMI:

```
┌─────────────────────────────────────────────────────────────┐
│                    CICLO DE SPRINT                           │
│                                                             │
│  1. Planificación ───────────────────────────────────────┐  │
│     └─ El stakeholder propone una funcionalidad           │  │
│     └─ Se desglosa en tareas (todowrite)                  │  │
│     └─ Se estima el esfuerzo                              │  │
│                                                           │  │
│  2. Ejecución ───────────────────────────────────────────┐│  │
│     └─ Se implementan los cambios                         ││  │
│     └─ Se usa todowrite para tracking                    ││  │
│     └─ Commits atómicos por funcionalidad                ││  │
│                                                           ││  │
│  3. Verificación ────────────────────────────────────────┐│  │
│     └─ npm run build (compila sin errores)               ││  │
│     └─ Se revisa visualmente el resultado                ││  │
│                                                           ││  │
│  4. Revisión ────────────────────────────────────────────┐│  │
│     └─ El stakeholder evalúa el resultado                ││  │
│     └─ Se identifican mejoras o bugs                    ││  │
│     └─ Se itera si es necesario                          ││  │
│                                                           ││  │
│  5. Documentación ───────────────────────────────────────┘│  │
│     └─ Se actualiza README y docs/ si aplica             │  │
│                                                           │  │
└───────────────────────────────────────────────────────────┘  │
                                                               │
  Cada sprint dura entre 1 y 3 interacciones hasta que         │
  la funcionalidad está completa y verificada.                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Evidencias del Proceso

| Área CMMI | Evidencia |
|-----------|-----------|
| REQM | Roadmap en README, conversaciones con el stakeholder |
| PP | Archivos de todo desglosados con todowrite |
| PMC | Historial de todowrite con estados (pending → in_progress → completed) |
| CM | Repositorio Git, estructura de carpetas definida |
| PPQA | `npm run build` exitoso, Oxlint configurado |
| RSKM | Grid fijo, separación de capas, canvas nativo |

---

## Métricas

| Métrica | Valor Actual |
|---------|--------------|
| Tiempo de build | ~400ms |
| Tamaño del bundle (gzip) | ~65KB |
| Módulos transformados | 30 |
| Tema visuales | 10 |
| Grid tamaño fijo | 20×15 celdas |
| Framerate objetivo | 60 FPS |
| Cobertura de linter | Estructural (Oxlint) |
