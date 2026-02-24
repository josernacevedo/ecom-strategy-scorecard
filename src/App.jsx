import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, Check, CheckCircle, Info, Sparkles, Zap, Shield } from 'lucide-react';
import { performSimulatedAudit } from './services/audit';

function App() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // 1. LÓGICA DE ESTÁNDARES GOOGLE CORE WEB VITALS (LCP)
    const getLCPStatus = (lcpString) => {
        const lcp = parseFloat(lcpString.replace('s', ''));
        if (lcp <= 2.5) return 'success';
        if (lcp <= 4.0) return 'warning';
        return 'critical';
    };

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url) return;
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
            
            // PRE-PROCESAMIENTO DE DATOS PARA MAKE.COM (Sin lógica compleja en el HTML)
            const payload = {
                email: email,
                url: url,
                score: auditData.score,
                lcp: auditData.technical.loadSpeed,
                seo: auditData.technical.seoScore,
                // Etiquetas de texto plano para evitar "?" o ":" en Gmail
                ai_status: auditData.ai_readiness.schema_detected ? "✅ ÓPTIMO" : "❌ CRÍTICO",
                ai_impact: auditData.ai_readiness.impact_label,
                roi_value: auditData.revenue_impact.projection,
                roi_justification: "Proyección basada en el modelo de regresión de VertexPoint que correlaciona la mejora del LCP y la claridad del CTA con el incremento histórico de la industria.",
                tech_source: "Google Lighthouse API v11",
                mkt_source: "OpenAI GPT-4o (NLP Analysis)",
                aeo_source: "Schema.org Validator Engine",
                // Transformamos el array del Roadmap en texto HTML para el correo
                roadmap_text: auditData.roadmap_30_days.map(item => 
                    `<strong>Fase ${item.day}</strong>: ${item.task} (Objetivo: ${item.target})`
                ).join('<br><br>')
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            
            if (response.ok) setEmailSent(true);
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
                    
                    {/* Header Estilo Consultoría */}
                    <div className="mb-8 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
                                VERTEXPOINT <span className="text-indigo-600">2026</span>
                            </h2>
                            <p className="text-sm text-slate-500 font-medium italic">Sistemas de Auditoría Agente Anti gravity</p>
                        </div>
                        <div className="hidden md:block text-right">
                            <span className="text-[10px] bg-slate-900 text-white px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                MBA RESEARCH EDITION
                            </span>
                        </div>
                    </div>

                    {/* Buscador Hero */}
                    <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 mb-10 shadow-2xl shadow-indigo-100">
                        <form onSubmit={handleAnalyze} className="max-w-3xl mx-auto text-center">
                            <h3 className="text-white text-lg font-bold mb-4">Iniciar Diagnóstico de E-commerce</h3>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    type="url"
                                    placeholder="https://tienda-premium.com"
                                    className="flex-1 px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isAnalyzing}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={isAnalyzing}
                                    className="bg-indigo-500 hover:bg-indigo-400 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-wider transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : "Analizar"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {auditData && (
                        <div className="space-y-8 animate-fade-in pb-20">
                            
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />

                            {/* Metodología (Rigor Académico MBA) */}
                            <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
                                <h4 className="text-sm font-black text-indigo-900 mb-2 flex items-center gap-2 uppercase tracking-wide">
                                    <Info size={18} /> Metodología de Scoring Vertex v2.0
                                </h4>
                                <p className="text-xs text-indigo-800/80 leading-relaxed font-medium">
                                    Puntuación determinada mediante una regresión ponderada basada en tres pilares: 
                                    $Score = (0.4 \cdot Tech) + (0.3 \cdot Mkt) + (0.3 \cdot Trust)$. 
                                    Este modelo prioriza el **AEO (Answer Engine Optimization)** para la visibilidad en motores de IA en 2026.
                                </p>
                            </div>

                            {/* Grid 3 Columnas: Factor 2026 */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Columna 1: Technical */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                                        <Zap size={14} /> Technical Health
                                    </div>
                                    <AuditCard 
                                        title="LCP Performance" 
                                        status={getLCPStatus(auditData.technical.loadSpeed)} 
                                        description={`Velocidad: ${auditData.technical.loadSpeed}.`} 
                                        techSource="Medición Core Web Vitals vía Lighthouse API (Mobile)."
                                    />
                                    <AuditCard 
                                        title="Platform" 
                                        status="info" 
                                        description={auditData.technical.platform} 
                                        techSource="Análisis de infraestructura en Headers y DOM."
                                    />
                                </div>

                                {/* Columna 2: Marketing */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-slate-400 uppercase text-[10px] font-black tracking-widest">
                                        <Sparkles size={14} /> Strategy (NLP)
                                    </div>
                                    <AuditCard 
                                        title="Value Prop" 
                                        status="info" 
                                        description={auditData.marketing.valueProposition} 
                                        techSource="Análisis semántico GPT-4o sobre Hero Section."
                                    />
                                    <AuditCard 
                                        title="Growth Rec" 
                                        status="warning" 
                                        description={auditData.marketing.vipRecommendation} 
                                        techSource="Algoritmo heurístico de conversión e-commerce."
                                    />
                                </div>

                                {/* Columna 3: AI READINESS */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-indigo-500 uppercase text-[10px] font-black tracking-widest">
                                        <Shield size={14} /> AI Readiness (AEO)
                                    </div>
                                    <AuditCard 
                                        title="Structured Data" 
                                        status={auditData.ai_readiness.schema_detected ? "success" : "critical"} 
                                        description={auditData.ai_readiness.schema_detected ? "JSON-LD Detectado" : "Sin Schema de Producto"} 
                                        techSource="Scraping de etiquetas application/ld+json para LLMs."
                                    />
                                    <div className={`p-4 rounded-xl border ${auditData.ai_readiness.schema_detected ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
                                        <p className="text-[10px] font-black uppercase mb-1 tracking-tighter">Impacto AEO 2026:</p>
                                        <p className="text-[11px] font-medium leading-tight">{auditData.ai_readiness.impact_label}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Roadmap Estratégico */}
                            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8">
                                <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3 uppercase tracking-tighter">
                                    Roadmap de Ejecución (30 Días)
                                </h3>
                                <div className="space-y-4">
                                    {auditData.roadmap_30_days.map((item, index) => (
                                        <div key={index} className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-300 transition-all group">
                                            <div className="text-indigo-600 font-black text-xs uppercase">Fase {item.day}</div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">{item.task}</p>
                                                <p className="text-[10px] text-slate-400 font-bold mt-1 tracking-widest uppercase italic">Objetivo: {item.target}</p>
                                            </div>
                                            {item.priority === "HIGH" && (
                                                <div className="bg-rose-100 text-rose-600 px-3 py-1 rounded-full text-[9px] font-black tracking-widest animate-pulse uppercase">
                                                    Urgente
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bloque ROI Proyectado */}
                            <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                                <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                    <div>
                                        <h3 className="text-2xl font-black mb-2 italic tracking-tighter">Sustento del ROI Proyectado</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                            Proyección basada en el modelo de regresión de VertexPoint que correlaciona la mejora del LCP y la claridad del CTA con el incremento histórico de la industria.
                                        </p>
                                    </div>
                                    <div className="text-center md:text-right">
                                        <div className="text-5xl font-black text-indigo-400 mb-2">{auditData.revenue_impact.projection}</div>
                                        <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Incremento de Conversión</div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Lead Magnet */}
                            <div className="bg-indigo-600 p-10 rounded-3xl text-white text-center shadow-2xl shadow-indigo-100">
                                <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Obtener Informe Técnico Completo</h3>
                                <p className="text-indigo-100 mb-8 max-w-lg mx-auto font-medium">Recibe el desglose de KPIs, análisis de competidores y el plan de acción detallado.</p>
                                <form onSubmit={sendReportToMake} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400" size={20} />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white text-slate-900 outline-none focus:ring-4 focus:ring-indigo-400/50 transition-all font-bold"
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
            </main>
        </div>
    );
}

export default App;
