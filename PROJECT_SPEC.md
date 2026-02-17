# PROYECTO: E-com Strategy Scorecard (SaaS Edition)

## 1. Visión y Propósito
Herramienta de auditoría dual para e-commerce que combina un análisis técnico profundo con recomendaciones estratégicas de marketing. Diseñada con una estética SaaS moderna para posicionar al creador como un experto en optimización de negocios digitales.

## 2. Pilares del Análisis (Agentic Audit)
El Agente de Antigravity debe realizar un escaneo en dos dimensiones:

### A. Dimensión Técnica (El "Cómo funciona")
- **Detección de Plataforma:** Identificar si es Shopify, WooCommerce, Magento, etc.
- **SEO On-page:** Analizar etiquetas H1-H3, Meta-descriptions y presencia de Alt-text.
- **Performance Perseguida:** Simular velocidad de carga y respuesta de elementos visuales.

### B. Dimensión Estratégica (El "Cómo vende")
- **Propuesta de Valor:** Extraer la promesa principal de la marca.
- **Análisis de Copy:** Evaluar si el tono es persuasivo o puramente informativo.
- **Trust Signals:** Verificar presencia de reviews, sellos de seguridad y políticas claras.
- **Recomendación VIP:** Generar una sugerencia de marketing personalizada basada en los puntos débiles detectados.

## 3. Especificaciones de Diseño (UI/UX)
- **Estilo:** SaaS Moderno (Inspiración: Stripe / OpenAI).
- **Paleta:** Fondo blanco/gris muy claro (`bg-slate-50`), textos en gris oscuro (`text-slate-900`), acentos en Azul Indigo (`bg-indigo-600`) para botones.
- **Componentes:**
    - Hero con el input de URL estilizado.
    - Grid de tarjetas para mostrar los resultados técnicos y de marketing por separado.
    - Modal de "Éxito" tras enviar el reporte.

## 4. Flujo de Automatización (Make.com Integration)
Al finalizar el análisis, se habilitará un formulario de "Recibir Reporte PDF por Email".
- **Payload del Webhook:**
    - `user_email`: Correo del visitante.
    - `competitor_url`: URL analizada.
    - `tech_data`: JSON con los hallazgos técnicos.
    - `marketing_insights`: Resumen de las recomendaciones de marketing.
- **Acción en Make.com:** 1. Generar un email con diseño profesional.
    2. Enviar el análisis como un "regalo" al usuario.
    3. **CTA de Networking:** Incluir un pie de página invitando a enviar un mensaje al correo electrónico josernacevedo@gmail.como conectar en LinkedIn para profundizar en la estrategia.

## 5. Instrucciones de Desarrollo para Antigravity
1. **Inicialización:** Crea un proyecto React + Vite + Tailwind CSS.
2. **Scraping Agent:** Configura el Browser Agent para que extraiga datos específicos del DOM sin ser bloqueado.
3. **Lógica de Score:** Crea una función que asigne un puntaje del 1 al 10 basado en los hallazgos técnicos.
4. **Endpoint:** Configura el envío de datos mediante un `POST` al Webhook de Make.com definido por el usuario.

## 6. Detalles de Interfaz (Listas Minimalistas)
- **Componente de Resultados:** Utiliza una lista vertical de tarjetas (`cards`) sin sombras pesadas, solo un borde fino (`border-slate-200`).
- **Iconografía:** Usa la librería `Lucide-React` para iconos minimalistas.
- **Micro-copy:** Cada punto técnico debe tener una etiqueta pequeña (Badge) que indique "Crítico", "Optimizado" o "Pendiente".

## 7. Referencia Visual Específica (Basado en VertexPoint)
- **Layout:** Sidebar lateral gris muy claro y área de contenido blanca.
- **Header de Métricas:** Tres tarjetas superiores con "Sparklines" (mini gráficos de línea) para tendencias técnicas.
- **Estilo de Lista:** Filas con mucho 'padding', bordes redondeados sutiles y uso de iconos minimalistas (Lucide-React) en lugar de mucho texto.
- **Feedback Visual:** Usar etiquetas verdes suaves para "Puntos Fuertes" y rojo suave para "Riesgos Críticos", tal como se ve en los porcentajes de la captura.