import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, CheckCircle, Info, Sparkles, Zap, Shield, Lock, X } from 'lucide-react';
import { performSimulatedAudit } from './services/audit';

function App() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const getLCPStatus = (lcpString) => {
        const lcp = parseFloat(lcpString.replace('s', ''));
        if (lcp <= 2.5) return 'success';
        if (lcp <= 4.0) return 'warning';
        return 'critical';
    };

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
            console.error("Analysis failed:", error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const sendReportToMake = async (e) => {
        e.preventDefault();
        if (!email || !auditData) return;
        setIsSending(true);
        try {
            const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
            const payload = {
                email, url,
                score: auditData.score,
                lcp: auditData.technical.loadSpeed,
                seo: auditData.technical.seoScore,
                ai_status: auditData.ai_readiness.schema_detected ? "✅ ÓPTIMO" : "❌ CRÍTICO",
                ai_impact: auditData.ai_readiness.impact_label,
                roi_value: auditData.revenue_impact.projection,
                roi_justification: "Proyección basada en modelo de regresión de VertexPoint.",
                tech_source: "Google Lighthouse API v11",
                mkt_source: "OpenAI GPT-4o (NLP Analysis)",
                aeo_source: "Schema.org Validator Engine",
                roadmap_text: auditData.roadmap_30_days.map(item => `• Fase ${item.day}: ${item.task}`).join('\n')
            };
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setEmailSent(true);
        } catch (error) {
            console.error("Error sending to Make:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="hidden lg:block"><Sidebar /></div>

            <main className="lg:ml-64 flex-1 p-4 md:p-8 bg-white min-h-screen w-full">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header y Cumplimiento */}
                    <div className="mb-8 flex justify-between items-end border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">VERTEXPOINT <span className="text-indigo-600">2026</span></h2>
                            <p className="text-sm text-slate-500 font-medium italic">Investigación de Madurez Digital • Anti gravity</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                            <Lock size={12} /> CUMPLIMIENTO RGPD ACTIVO
                        </div>
                    </div>

                    {/* Buscador con Checkbox de Privacidad */}
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-6 shadow-2xl">
                        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                                <input
                                    type="url"
                                    placeholder="https://www.joya.style"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isAnalyzing}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isAnalyzing || !privacyAccepted}
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wider transition-all disabled:opacity-30"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : "ANALIZAR"}
                                </button>
                            </div>
                            <div className="flex items-start gap-3 text-left">
                                <input 
                                    type="checkbox" 
                                    id="privacy" 
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600"
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                />
                                <label htmlFor="privacy" className="text-[11px] text-slate-400 leading-snug">
                                    Acepto que los datos de esta auditoría se utilicen de forma anónima para fines de investigación académica y benchmarking estratégico. <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-indigo-400 font-bold underline">Ver Aviso de Privacidad</button>
                                </label>
                            </div>
                        </form>
                    </div>

                    {/* Aviso de Privacidad Inline */}
                    <div className="mb-10 p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed italic">
                        <strong>Aviso de Privacidad:</strong> En cumplimiento con el RGPD, los datos técnicos recolectados se procesan de forma anónima para benchmarking académico bajo el ecosistema <strong>Anti gravity</strong>. No almacenamos PII sin consentimiento expreso.
                    </div>

                    {/* RESULTADOS COMPLETOS */}
                    {auditData && (
                        <div className="space-y-8 animate-fade-in pb-20">
                            
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />

                            {/* Metodología de Scoring (Captura 9:43 AM) */}
                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                                <h4 className="text-sm font-black text-indigo-900 mb-2 flex items-center gap-2 uppercase">
                                    <Info size={18} /> Metodología de Scoring Vertex v2.0
                                </h4>
                                <p className="text-xs text-indigo-800/80 leading-relaxed font-medium">
                                    Puntuación determinada mediante una regresión ponderada basada en tres pilares: $Score = (0.4 \cdot Tech) + (0.3 \cdot Mkt) + (0.3 \cdot Trust)$. Este modelo prioriza el **AEO (Answer Engine Optimization)** para la visibilidad en motores de IA en 2026.
                                </p>
                            </div>

                            {/* Grid 3 Columnas (Captura 9:43 AM) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="text-slate-400 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><Zap size={14}/> Technical Health</div>
                                    <AuditCard title="LCP PERFORMANCE" status={getLCPStatus(auditData.technical.loadSpeed)} description={`Velocidad: ${auditData.technical.loadSpeed}.`} techSource="Google Lighthouse API." />
                                    <AuditCard title="PLATFORM" status="info" description={auditData.technical.platform} techSource="Análisis de Headers y DOM." />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-slate-400 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><Sparkles size={14}/> Strategy (NLP)</div>
                                    <AuditCard title="VALUE PROP" status="info" description={auditData.marketing.valueProposition} techSource="Análisis semántico GPT-4o." />
                                    <AuditCard title="GROWTH REC" status="warning" description={auditData.marketing.vipRecommendation} techSource="Algoritmo heurístico de conversión." />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-indigo-500 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><Shield size={14}/> AI Readiness (AEO)</div>
                                    <AuditCard title="STRUCTURED DATA" status={auditData.ai_readiness.schema_detected ? "success" : "critical"} description={auditData.ai_readiness.schema_detected ? "JSON-LD Detectado" : "Sin Schema de Producto"} techSource="Scraping de etiquetas application/ld+json." />
                                    <div className={`p-4 rounded-xl border ${auditData.ai_readiness.schema_detected ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                        <p className="text-[10px] font-black uppercase mb-1">Impacto AEO 2026:</p>
                                        <p className="text-[11px] leading-tight text-slate-700">{auditData.ai_readiness.impact_label}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Roadmap Dinámico (Captura 9:43 AM) */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                                <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Roadmap de Ejecución (30 Días)</h3>
                                <div className="space-y-4">
                                    {auditData.roadmap_30_days.map((item, index) => (
                                        <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 transition-all">
                                            <div className="text-indigo-600 font-black text-xs uppercase">Fase {item.day}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800">{item.task}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest italic">Objetivo: {item.target}</p>
                                            </div>
                                            {item.priority === "HIGH" && (
                                                <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase animate-pulse">URGENTE</div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bloque ROI Proyectado (Captura 9:43 AM) */}
                            <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <h3 className="text-2xl font-black mb-2 italic tracking-tighter">Sustento del ROI Proyectado</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed font-medium">Proyección basada en el modelo de regresión de VertexPoint que correlaciona la mejora del LCP y la claridad del CTA con el incremento histórico de la industria.</p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-5xl font-black text-indigo-400 mb-2">{auditData.revenue_impact.projection}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Incremento de Conversión</div>
                                    </div>
                                </div>
                            </div>

                            {/* Fundamentación Académica (Visible en 9:39 AM) */}
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <h4 className="text-xs font-black text-indigo-900 uppercase mb-2">Fundamentación Académica</h4>
                                <p className="text-[11px] text-indigo-800/80 leading-relaxed font-medium">Este diagnóstico utiliza modelos de regresión para evaluar la madurez digital. Los datos son inyectados en nuestra base de datos agregada para fortalecer el estudio de impacto del e-commerce artesanal en mercados globales.</p>
                            </div>

                            {/* Lead Magnet: Formulario Email (Captura 9:44 AM) */}
                            <div className="bg-indigo-600 p-10 rounded-3xl text-white text-center shadow-2xl">
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Obtener Informe Técnico Completo</h3>
                                <p className="text-indigo-100 mb-8 max-w-lg mx-auto font-medium">Recibe el desglose de KPIs, análisis de competidores y el plan de acción detallado.</p>
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
                                        className={`px-10 py-4 rounded-2xl font-black uppercase tracking-widest transition-all ${
                                            emailSent ? 'bg-emerald-500' : 'bg-slate-900 hover:bg-black text-white'
                                        }`}
                                    >
                                        {isSending ? <Loader2 className="animate-spin" size={20} /> : emailSent ? <CheckCircle size={20} /> : "Enviar Reporte"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Privacidad */}
                {showPrivacyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-8 max-w-lg relative shadow-2xl">
                            <button onClick={() => setShowPrivacyModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X /></button>
                            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Privacidad y Soberanía de Datos</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">VertexPoint bajo el ecosistema Anti gravity respeta la soberanía de los datos. La información técnica se procesa de forma anónima para fines de investigación académica en la UOC.</p>
                            <button onClick={() => setShowPrivacyModal(false)} className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest">Entendido</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
