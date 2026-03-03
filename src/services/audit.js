/**
 * VertexPoint Audit Engine v4.1 - ROBUST MODE
 * Solución a Errores 429 y TypeErrors detectados en consola.
 */

// NOTA: Para producción, genera tu propia llave en Google Cloud Console.
const GOOGLE_API_KEY = AIzaSyA3UTqS_pH4VGTM--vA55nJ-sSdh0sp_xI

export const performSimulatedAudit = async (url) => {
  try {
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=SEO&category=PERFORMANCE&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(psiUrl);
    const data = await response.json();

    // VALIDACIÓN DE SEGURIDAD: Si Google falla, evitamos la pantalla blanca
    if (data.error || !data.lighthouseResult) {
      console.error("Error de la API de Google:", data.error?.message || "Sin datos");
      return { error: "Límite de Google excedido. Intenta en 1 min." };
    }

    // Extracción segura de datos
    const audits = data.lighthouseResult.audits;
    const lcpValue = audits['largest-contentful-paint']?.numericValue / 1000 || 0;
    const seoScore = Math.floor(data.lighthouseResult.categories.seo?.score * 100) || 0;

    // Detección de Plataforma por Evidencia (Universal)
    const rawData = JSON.stringify(data).toLowerCase();
    let platform = "Custom Architecture";
    if (rawData.includes('shopify')) platform = "Shopify (Plus Edition)";
    else if (rawData.includes('wp-content') || rawData.includes('woocommerce')) platform = "WooCommerce";
    else if (rawData.includes('vtex')) platform = "VTEX Enterprise";

    return {
      url: url,
      score: (data.lighthouseResult.categories.performance.score * 10).toFixed(1),
      technical: {
        platform: platform,
        loadSpeed: `${lcpValue.toFixed(1)}s`,
        seoScore: seoScore
      },
      ai_readiness: {
        schema_detected: rawData.includes('ld+json'),
        impact_label: rawData.includes('ld+json') ? "Alta visibilidad IA" : "Baja visibilidad IA"
      }
    };
  } catch (error) {
    return { error: "Fallo crítico en la conexión." };
  }
};
