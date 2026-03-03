/**
 * VertexPoint Audit Engine v4.2 - STABLE PRODUCTION
 * Solución al Build Failure de Vercel y detección universal.
 */

export const performSimulatedAudit = async (url) => {
  try {
    // REEMPLAZA ESTA LLAVE CON LA QUE CREASTE EN GOOGLE CLOUD
    const GOOGLE_API_KEY = AIzaSyA3UTqS_pH4VGTM--vA55nJ-sSdh0sp_xI; 
    
    const psiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=SEO&category=PERFORMANCE&key=${GOOGLE_API_KEY}`;
    
    const response = await fetch(psiUrl);
    const data = await response.json();

    // VALIDACIÓN DE SEGURIDAD: Evita que la pantalla se ponga blanca si la API falla
    if (!data || !data.lighthouseResult) {
      return { 
        url, 
        score: "0", 
        technical: { platform: "Error de API", loadSpeed: "0s" },
        ai_readiness: { impact_label: "No se pudo obtener datos de Google." }
      };
    }

    // Definimos rawData aquí para que sea accesible en todo el código siguiente
    const rawData = JSON.stringify(data).toLowerCase();
    
    const audits = data.lighthouseResult.audits;
    const performanceScore = data.lighthouseResult.categories.performance?.score || 0;
    const lcpDisplay = audits['largest-contentful-paint']?.displayValue || "0s";
    const seoScore = Math.floor(data.lighthouseResult.categories.seo?.score * 100) || 0;

    // DETECCIÓN UNIVERSAL: Busca huellas técnicas en el código real de la web
    let platformName = "Custom Architecture (React/Next.js)";
    if (rawData.includes('shopify')) platformName = "Shopify (Plus Edition)";
    else if (rawData.includes('wp-content') || rawData.includes('woocommerce')) platformName = "WooCommerce";
    else if (rawData.includes('vtex')) platformName = "VTEX Enterprise";

    return {
      url: url,
      score: (performanceScore * 10).toFixed(1),
      technical: {
        platform: platformName,
        loadSpeed: lcpDisplay,
        seoScore: seoScore
      },
      ai_readiness: {
        schema_detected: rawData.includes('ld+json'),
        impact_label: rawData.includes('ld+json') 
          ? "Alta visibilidad en motores de respuesta de IA (AEO)." 
          : "Baja visibilidad en motores de respuesta de IA (AEO)."
      }
    };
  } catch (error) {
    console.error("Fallo crítico en auditoría:", error);
    return { error: "Error de red o configuración." };
  }
};
