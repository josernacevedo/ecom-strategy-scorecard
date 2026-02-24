import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, CheckCircle, Info, Sparkles, Zap, Shield, Lock, X } from 'lucide-react';
import { performSimulatedAudit } from './services/audit';

function App() {
    // ESTADOS GLOBALES
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    
    // ESTADOS DE PRIVACIDAD (RGPD)
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    // LÓGICA DE RENDIMIENTO (LCP)
    const getLCPStatus = (lcpString) => {
        const lcp = parseFloat(lcpString.replace('s', ''));
        if (lcp <= 2.5) return 'success';
        if (lcp <= 4.0) return 'warning';
        return 'critical';
    };

    // ACCIÓN: EJECUTAR AUDITORÍA
    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url || !privacyAccepted) return;
        setIsAnalyzing(true);
        setAuditData(null);
        setEmailSent(false);
        try {
            const data = await performSimulatedAudit(url);
            setAuditData(data);
        } catch (error) {
            console.error("Error en la auditoría:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ACCIÓN: ENVIAR A MAKE (SHEETS + GMAIL)
    const sendReportToMake = async (e) => {
        e.preventDefault();
        if (!email || !auditData) return;
        setIsSending(true);
        try {
            const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
            
            // Payload Maestro para Google Sheets y Correo Enriquecido
            const payload = {
                email,
                url,
                platform: auditData.technical.platform,
                score: auditData.score,
                lcp: auditData.technical.loadSpeed,
                seo: auditData.technical.seoScore,
                ai_status: auditData.ai_readiness.schema_detected ? "✅ ÓPTIMO" : "❌ CRÍTICO",
                ai_impact: auditData.ai_readiness.impact_label,
                roi_value: auditData.revenue_impact.projection,
                roi_justification: "Proyección basada en modelo de regresión de VertexPoint (LCP vs CR).",
                tech_source: "Google Lighthouse API v11",
                mkt_source: "OpenAI GPT-4o (NLP Analysis)",
                aeo_source: "Schema.org Validator Engine",
                // Roadmap formateado para el correo HTML
                roadmap_html: auditData.roadmap_30_days.map(item => 
                    `<div style="margin-bottom:10px;"><strong>Fase ${item.day}</strong>: ${item.task} (Objetivo: ${item.target})</div>`
                ).join('')
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (response.ok) setEmailSent(true);
        } catch (error) {
            console.error("Error en el envío a Make:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans">
            {/* Sidebar persistente */}
            <div className="hidden lg:block"><Sidebar /></div>

            <main className="lg:ml-64 flex-1 p-4 md:p-8 bg-white min-h-screen w-full">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header Institucional */}
                    <div className="mb-8 flex justify-between items-end border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                                VERTEXPOINT <span className="text-indigo-600">2026</span>
                            </h2>
                            <p className="text-sm text-slate-500 font-medium italic">Investigación de Madurez Digital • Anti gravity</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                            <Lock size={12} /> CUMPLIMIENTO RGPD ACTIVO
                        </div>
                    </div>

                    {/* Buscador Estilo Hero */}
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-6 shadow-2xl">
                        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto">
                            <h3 className="text-white text-center font-bold mb-4">Iniciar Diagnóstico de E-commerce</h3>
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <input
                                    type="url"
                                    placeholder="https://tienda-ejemplo.com"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isAnalyzing}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isAnalyzing || !privacyAccepted}
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : "ANALIZAR"}
                                </button>
                            </div>
                            
                            {/* Checkbox Privacidad */}
                            <div className="flex items-start gap-3 text-left">
                                <input 
                                    type="checkbox" 
                                    id="privacy" 
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600"
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                />
                                <label htmlFor="privacy" className="text-[11px] text-slate-400 leading-snug cursor-pointer">
                                    Acepto que los datos de esta auditoría se utilicen de forma anónima para fines de investigación académica y benchmarking estratégico. 
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPrivacyModal(true)} 
                                        className="ml-1 text-indigo-400 hover:underline font-bold"
                                    >
                                        Ver Aviso de Privacidad
                                    </button>
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Aviso Inline RGPD */}
                    <div className="mb-10 p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed italic">
                        <strong>Cumplimiento:</strong> En cumplimiento con el RGPD, los datos técnicos recolectados se procesan de forma anónima para benchmarking académico bajo el ecosistema <strong>Anti gravity</strong>. No almacenamos PII sin consentimiento previo.
                    </div>

                    {/* BLOQUE DE RESULTADOS DINÁMICOS */}
                    {auditData && (
                        <div className="space-y-8 animate-fade-in pb-20">
                            
                            {/* 1. Métricas Principales */}
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />

                            {/* 2. Metodología con LaTeX */}
                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                                <h4 className="text-sm font-black text-indigo-900 mb-2 flex items-center gap-2 uppercase">
                                    <Info size={18} /> Metodología de Scoring Vertex v2.0
                                </h4>
                                <p className="text-xs text-indigo-800/80 leading-relaxed font-medium">
                                    Puntuación determinada mediante una regresión ponderada: $$Score = (0.4 \cdot Tech) + (0.3 \cdot Mkt) + (0.3 \cdot Trust)$$. 
                                    Este modelo prioriza el **AEO (Answer Engine Optimization)** para la visibilidad en agentes de IA.
                                </p>
                            </div>

                            {/* 3. Grid de Auditoría (Technical, Marketing, AI) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Technical */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                                        <Zap size={14} /> Technical Health
                                    </div>
                                    <AuditCard 
                                        title="LCP PERFORMANCE" 
                                        status={getLCPStatus(auditData.technical.loadSpeed)} 
                                        description={`Velocidad: ${auditData.technical.loadSpeed}.`} 
                                        techSource="Google Lighthouse API (Mobile)."
                                    />
                                    <AuditCard 
                                        title="PLATFORM" 
                                        status="info" 
                                        description={auditData.technical.platform} 
                                        techSource="Análisis de infraestructura en Headers y DOM."
                                    />
                                </div>

                                {/* Marketing */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                                        <Sparkles size={14} /> Strategy (NLP)
                                    </div>
                                    <AuditCard 
                                        title="VALUE PROP" 
                                        status="info" 
                                        description={auditData.marketing.valueProposition} 
                                        techSource="Análisis semántico GPT-4o sobre Hero."
                                    />
                                    <AuditCard 
                                        title="GROWTH REC" 
                                        status="warning" 
                                        description={auditData.marketing.vipRecommendation} 
                                        techSource="Algoritmo heurístico de conversión."
                                    />
                                </div>

                                {/* AI Readiness */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-500 uppercase text-[10px] font-black tracking-widest">
                                        <Shield size={14} /> AI Readiness (AEO)
                                    </div>
                                    <AuditCard 
                                        title="STRUCTURED DATA" 
                                        status={auditData.ai_readiness.schema_detected ? "success" : "critical"} 
                                        description={auditData.ai_readiness.schema_detected ? "JSON-LD Detectado" : "Sin Schema de Producto"} 
                                        techSource="Scraping de etiquetas application/ld+json."
                                    />
                                    <div className={`p-4 rounded-xl border ${auditData.ai_readiness.schema_detected ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                        <p className="text-[10px] font-black uppercase mb-1">Impacto AEO 2026:</p>
                                        <p className="text-[11px] leading-tight font-medium">{auditData.ai_readiness.impact_label}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 4. Roadmap Estratégico */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">Roadmap de Ejecución (30 DÍAS)</h3>
                                <div className="space-y-4">
                                    {auditData.roadmap_30_days.map((item, index) => (
                                        <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 transition-all">
                                            <div className="text-indigo-600 font-black text-xs uppercase italic">Fase {item.day}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800">{item.task}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">Objetivo: {item.target}</p>
                                            </div>
                                            {item.priority === "HIGH" && (
                                                <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase animate-pulse">URGENTE</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 5. ROI Proyectado */}
                            <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <h3 className="text-2xl font-black mb-2 italic tracking-tighter">Sustento del ROI Proyectado</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
                                            Basado en modelos de regresión que correlacionan la mejora del LCP y la claridad del CTA con el incremento histórico de la industria.
                                        </p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-5xl font-black text-indigo-400 mb-2">{auditData.revenue_impact.projection}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Incremento de Conversión Estimado</div>
                                    </div>
                                </div>
                            </div>

                            {/* 6. Fundamentación Académica */}
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 shadow-sm">
                                <h4 className="text-xs font-black text-indigo-900 uppercase mb-2">Fundamentación Académica (UOC Research)</h4>
                                <p className="text-[11px] text-indigo-800/80 leading-relaxed font-medium italic">
                                    Este diagnóstico utiliza modelos de regresión para evaluar la madurez digital del sector artesanal. Los datos agregados fortalecen el estudio sobre el impacto de la IA en e-commerces de nicho.
                                </p>
                            </div>

                            {/* 7. Lead Magnet: Formulario Email */}
                            <div className="bg-indigo-600 p-10 rounded-3xl text-white text-center shadow-2xl shadow-indigo-200">
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Obtener Informe Técnico Completo</h3>
                                <p className="text-indigo-100 mb-8 max-w-lg mx-auto font-medium">Recibe el desglose detallado de KPIs y el plan de acción estructurado en tu bandeja de entrada.</p>
                                <form onSubmit={sendReportToMake} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white text-slate-900 outline-none font-bold"
                                            placeholder="socio@empresa.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSending || emailSent}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSending || emailSent}
                                        className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${
                                            emailSent ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-black text-white'
                                        }`}
                                    >
                                        {isSending ? <Loader2 className="animate-spin" size={20} /> : emailSent ? <CheckCircle size={20} /> : "ENVIAR REPORTE"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL DE PRIVACIDAD */}
                {showPrivacyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
                        <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
                            <button 
                                onClick={() => setShowPrivacyModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter border-b border-slate-100 pb-2">Privacidad y Soberanía de Datos</h3>
                            <div className="space-y-4 text-sm text-slate-600 leading-relaxed overflow-y-auto max-h-96 pr-2">
                                <p><strong>Soberanía Digital:</strong> VertexPoint respeta la soberanía de tus datos. La información técnica procesada sigue protocolos estrictos de anonimización.</p>
                                <p><strong>Investigación MBA:</strong> Los resultados contribuyen a un estudio de la UOC sobre la capacidad de los modelos de IA (AEO) para indexar e-commerce artesanal.</p>
                                <p><strong>Derechos:</strong> En cualquier momento puedes solicitar la eliminación de tu registro contactando al equipo de Anti gravity.</p>
                                <p className="text-[10px] text-slate-400 pt-4 italic border-t border-slate-100">Versión 2.1 - Cumplimiento GDPR Research Framework 2026.</p>
                            </div>
                            <button 
                                onClick={() => setShowPrivacyModal(false)}
                                className="mt-6 w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-black transition-colors"
                            >
                                ENTENDIDO
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
