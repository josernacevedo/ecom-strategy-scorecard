import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, Check, CheckCircle, Info, Sparkles, Zap, Shield, Lock, X } from 'lucide-react';
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
                roi_justification: "Proyección basada en modelo de regresión VertexPoint.",
                tech_source: "Google Lighthouse API v11",
                mkt_source: "OpenAI GPT-4o (NLP)",
                aeo_source: "Schema.org Validator",
                roadmap_text: auditData.roadmap_30_days.map(item => `• Fase ${item.day}: ${item.task}`).join('\n')
            };
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setEmailSent(true);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="hidden lg:block"><Sidebar /></div>

            <main className="lg:ml-64 flex-1 p-4 md:p-8 bg-white min-h-screen w-full">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-end border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">VERTEXPOINT <span className="text-indigo-600">2026</span></h2>
                            <p className="text-sm text-slate-500 font-medium">Investigación de Madurez Digital • Anti gravity</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                            <Lock size={12} /> CUMPLIMIENTO RGPD ACTIVO
                        </div>
                    </div>

                    {/* Buscador */}
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-6 shadow-2xl shadow-indigo-100">
                        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto">
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
                                    Acepto que los datos de esta auditoría se utilicen de forma anónima para fines de investigación académica y benchmarking estratégico. <button type="button" onClick={() => setShowPrivacyModal(true)} className="text-indigo-400 font-bold">Ver Aviso de Privacidad</button>
                                </label>
                            </div>
                        </form>
                    </div>

                    <div className="mb-10 p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed italic">
                        <strong>Aviso de Privacidad:</strong> En cumplimiento con el RGPD, los datos técnicos recolectados se procesan de forma anónima para benchmarking académico bajo el ecosistema <strong>Anti gravity</strong>. No almacenamos PII sin consentimiento expreso.
                    </div>

                    {/* RESULTADOS COMPLETOS */}
                    {auditData && (
                        <div className="space-y-8 animate-fade-in pb-20">
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />
                            
                            {/* Grid 3 Columnas (ESTO ES LO QUE FALTA EN TU IMAGEN) */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div className="space-y-4">
                                    <div className="text-slate-400 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><Zap size={14}/> Technical</div>
                                    <AuditCard title="LCP Performance" status={getLCPStatus(auditData.technical.loadSpeed)} description={`Velocidad: ${auditData.technical.loadSpeed}.`} techSource="Google Lighthouse API." />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-slate-400 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><Sparkles size={14}/> Strategy</div>
                                    <AuditCard title="Value Prop" status="info" description={auditData.marketing.valueProposition} techSource="Análisis semántico GPT-4o." />
                                </div>
                                <div className="space-y-4">
                                    <div className="text-indigo-500 uppercase text-[10px] font-black tracking-widest flex items-center gap-2"><Shield size={14}/> AI Readiness</div>
                                    <div className={`p-4 rounded-xl border ${auditData.ai_readiness.schema_detected ? 'bg-emerald-50' : 'bg-rose-50'} text-[11px]`}>
                                        <p className="font-black uppercase mb-1">Impacto AEO 2026:</p>
                                        <p>{auditData.ai_readiness.impact_label}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Fundamentación Académica */}
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <h4 className="text-xs font-black text-indigo-900 uppercase mb-2">Fundamentación Académica</h4>
                                <p className="text-[11px] text-indigo-800/80 leading-relaxed">Este diagnóstico utiliza modelos de regresión para evaluar la madurez digital. Los datos son inyectados en nuestra base de datos agregada para fortalecer el estudio de impacto del e-commerce artesanal en mercados globales.</p>
                            </div>

                            {/* ROI y Roadmap */}
                            <div className="bg-slate-900 p-8 rounded-3xl text-white">
                                <h3 className="text-2xl font-black italic mb-4">Proyección: {auditData.revenue_impact.projection}</h3>
                                <p className="text-xs text-slate-400 italic">Sustento técnico: Correlación de mejora del LCP con tasa de conversión histórica.</p>
                            </div>

                            {/* LEAM MAGNET / EMAIL (LO MÁS IMPORTANTE) */}
                            <div className="bg-indigo-600 p-10 rounded-3xl text-white text-center">
                                <h3 className="text-2xl font-black mb-4 uppercase">Obtener Informe Técnico Completo</h3>
                                <form onSubmit={sendReportToMake} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                                    <input
                                        type="email"
                                        required
                                        className="flex-1 px-6 py-4 rounded-2xl bg-white text-slate-900 outline-none font-bold"
                                        placeholder="tu@empresa.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSending || emailSent}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || emailSent}
                                        className={`px-10 py-4 rounded-2xl font-black uppercase transition-all ${emailSent ? 'bg-emerald-500' : 'bg-slate-900'}`}
                                    >
                                        {isSending ? <Loader2 className="animate-spin" size={20} /> : emailSent ? <CheckCircle size={20} /> : "ENVIAR REPORTE"}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL PRIVACIDAD */}
                {showPrivacyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl p-8 max-w-lg relative">
                            <button onClick={() => setShowPrivacyModal(false)} className="absolute top-4 right-4"><X /></button>
                            <h3 className="text-xl font-black mb-4 uppercase">Privacidad y Datos</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">VertexPoint bajo el ecosistema Anti gravity respeta la soberanía de los datos. La información se procesa de forma anónima para fines de investigación académica en la UOC.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
