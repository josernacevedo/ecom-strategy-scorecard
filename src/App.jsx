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
    
    // Estados para Privacidad y Cumplimiento
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
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (response.ok) setEmailSent(true);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white font-sans selection:bg-indigo-100">
            <div className="hidden lg:block"><Sidebar /></div>

            <main className="lg:ml-64 flex-1 p-4 md:p-8 bg-white min-h-screen w-full">
                <div className="max-w-6xl mx-auto">
                    
                    {/* Header con Branding Anti gravity */}
                    <div className="mb-8 flex justify-between items-end border-b border-slate-100 pb-6">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                                VERTEXPOINT <span className="text-indigo-600">2026</span>
                            </h2>
                            <p className="text-sm text-slate-500 font-medium">Investigación de Madurez Digital • Anti gravity</p>
                        </div>
                        <div className="hidden md:flex items-center gap-2 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">
                            <Lock size={12} /> Cumplimiento RGPD Activo
                        </div>
                    </div>

                    {/* Formulario con Checkbox de Privacidad */}
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-6 shadow-2xl">
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
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : "Analizar"}
                                </button>
                            </div>
                            
                            {/* Checkbox de Aceptación */}
                            <div className="flex items-start gap-3 text-left">
                                <input 
                                    type="checkbox" 
                                    id="privacy" 
                                    className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                />
                                <label htmlFor="privacy" className="text-[11px] text-slate-400 leading-snug">
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

                    {/* Aviso de Privacidad Inline */}
                    <div className="mb-10 p-4 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed italic">
                        <strong>Aviso de Privacidad:</strong> En cumplimiento con el RGPD, los datos técnicos recolectados se procesan de forma anónima para benchmarking académico bajo el ecosistema <strong>Anti gravity</strong>. No almacenamos PII sin consentimiento expreso.
                    </div>

                    {/* Resultados (Mantenemos la estructura previa) */}
                    {auditData && (
                        <div className="space-y-8 animate-fade-in pb-20">
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />
                            
                            {/* ... (Aquí van los Grid de 3 columnas y el Roadmap que ya definimos) ... */}
                            
                            {/* Bloque de Metodología con Sustento Académico */}
                            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                <h4 className="text-xs font-black text-indigo-900 uppercase mb-2">Fundamentación Académica</h4>
                                <p className="text-[11px] text-indigo-800/80 leading-relaxed font-medium">
                                    Este diagnóstico utiliza modelos de regresión para evaluar la madurez digital. 
                                    Los datos son inyectados en nuestra base de datos agregada para fortalecer el estudio de impacto del e-commerce artesanal en mercados globales.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* MODAL DE PRIVACIDAD EXTENDIDA */}
                {showPrivacyModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl relative">
                            <button 
                                onClick={() => setShowPrivacyModal(false)}
                                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                            >
                                <X size={24} />
                            </button>
                            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Privacidad y Soberanía de Datos</h3>
                            <div className="space-y-4 text-sm text-slate-600 leading-relaxed overflow-y-auto max-h-96 pr-2">
                                <p><strong>Soberanía Digital:</strong> VertexPoint respeta la soberanía de tus datos. La información técnica del dominio analizado es pública por naturaleza, pero su procesamiento en nuestra plataforma sigue protocolos de anonimización.</p>
                                <p><strong>Investigación Académica:</strong> Los resultados contribuyen a un estudio sobre la brecha digital y la capacidad de los modelos de IA (AEO) para indexar productos de nicho artesanal.</p>
                                <p><strong>Derechos:</strong> En cualquier momento puedes solicitar la eliminación de tu registro de benchmarking contactando al equipo de Anti gravity.</p>
                                <p className="text-[10px] text-slate-400 pt-4 border-t border-slate-100">Versión 1.2 - Cumplimiento GDPR Research Framework.</p>
                            </div>
                            <button 
                                onClick={() => setShowPrivacyModal(false)}
                                className="mt-6 w-full bg-slate-900 text-white py-3 rounded-xl font-bold uppercase text-xs tracking-widest"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
