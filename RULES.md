# REGLAS DE ORO: E-COM STRATEGY SCORECARD

## 1. Arquitectura y Código (Standard "Clean Code")
- **Componentización:** Prohibido crear archivos de más de 200 líneas. Divide la interfaz en componentes pequeños (ej. `Sidebar.jsx`, `AuditCard.jsx`, `MetricHeader.jsx`).
- **Framework:** React + Vite + Tailwind CSS.
- **Naming:** Variables y funciones en inglés descriptivo (ej. `handleAnalyzeCompetitor`).
- **Iconografía:** Uso exclusivo de la librería `Lucide-React`.

## 2. Identidad Visual (Estilo VertexPoint)
- **Fidelidad:** Mantener el minimalismo extremo: bordes redondeados sutiles (`rounded-xl`), sombras casi imperceptibles y mucho espacio negativo.
- **Colorimetría:** - Fondo: `#F8FAFC` (Slate 50).
    - Acentos: `#4F46E5` (Indigo 600) para acciones principales.
    - Estados: Verde esmeralda para éxitos, ámbar para advertencias y rojo coral para fallos críticos.
- **Tipografía:** Usar una fuente sans-serif limpia (Inter o Geist).

## 3. Comportamiento de la IA (Lógica de Negocio)
- **Idioma de la UI:** La interfaz debe estar 100% en español profesional.
- **Calidad del Dato:** Toda la información extraída por el Browser Agent debe ser validada. No inventar datos si el sitio web no los proporciona.
- **Estructura JSON:** Los resultados del análisis técnico y de marketing deben estar estructurados internamente como un objeto JSON para facilitar la conexión con Make.com.

## 4. Flujo de Automatización y Seguridad
- **Webhooks:** No "hardcodear" la URL de Make.com. Debe leerse desde una variable de entorno `.env`.
- **Privacidad:** El sistema no debe almacenar datos sensibles de navegación, solo los hallazgos de la auditoría.

## 5. Tono de Comunicación (Networking Mode)
- **Personalidad:** La herramienta debe sonar como un consultor estratégico experto.
- **Llamada a la Acción (CTA):** Los mensajes de éxito deben invitar al usuario a profundizar en el análisis, reforzando la marca personal del creador.