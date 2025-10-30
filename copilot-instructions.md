# GitHub Copilot Instructions

## Objetivo
Personalizar las sugerencias de GitHub Copilot para que sean más claras, útiles y coherentes con las buenas prácticas del proyecto.

## Reglas Generales
- Escribir código limpio, legible y documentado.
- Usar nombres de variables en inglés y formato **camelCase**.
- Agregar comentarios antes de cada función explicando su propósito.
- Evitar duplicar código o generar bloques innecesarios.

## Para proyectos JavaScript / Node.js
- Priorizar el uso de **async/await**.
- Mantener una estructura ordenada: routes → controllers → services → models.
- Manejar los errores con un middleware global y respuestas JSON.

## Para proyectos React
- Usar **componentes funcionales** y **hooks**.
- Dividir componentes grandes en piezas pequeñas y reutilizables.
- Evitar lógica compleja dentro del `render()`.

## Buenas Prácticas
- Incluir comentarios en cada archivo nuevo.
- Validar los datos antes de enviarlos al backend.
- Seguir las convenciones del equipo o del curso.

## Qué evitar
- No dejar código comentado ni sin uso.
- No usar `var` (usar `const` o `let`).
- No generar funciones anidadas sin necesidad.

---
Estas reglas ayudan a Copilot a comprender mejor el estilo de desarrollo del proyecto.
