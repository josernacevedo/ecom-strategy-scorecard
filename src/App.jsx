import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, Check, CheckCircle, Info } from 'lucide-react';
import { performSimulatedAudit } from './services/audit';

function App() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // 1. LÓGICA DE ESTÁNDARES GOOGLE
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
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    url,
                    auditData,
                    metadata: { consultant: "Jose Serna Acevedo", brand: "Anti gravity" }
                }),
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
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">VertexPoint Audit</h2>
                        <p className="text-sm text-slate-500">Sistemas de Automatización Anti gravity.</p>
                    </div>

                    {/* Formulario de Búsqueda */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-10">
                        <form onSubmit={handleAnalyze} className="max-w-2xl">
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="url"
                                    placeholder="https://tu-ecommerce.com"
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 outline-none"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isAnalyzing}
                                />
                                <button
                                    type="submit"
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : "Analyze"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* 2. ZONA DE RESULTADOS (Donde va lo nuevo) */}
                    {auditData && (
                        <div className="space-y-8 animate-fade-in">
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />

                            {/* Grid con Transparencia Técnica (techSource) */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        Technical Analysis 
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">Lighthouse Engine</span>
                                    </h3>
                                    <AuditCard 
                                        title="Platform" 
                                        status="success" 
                                        description={`Detected ${auditData.technical.platform}.`} 
                                        techSource="Detección vía firmas de CMS en cabeceras HTTP y estructura del DOM."
                                    />
                                    <AuditCard 
                                        title="Performance (LCP)" 
                                        status={getLCPStatus(auditData.technical.loadSpeed)} 
                                        description={`LCP: ${auditData.technical.loadSpeed}.`} 
                                        techSource="Medición oficial de Google Core Web Vitals (Largest Contentful Paint)."
                                    />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                                        Marketing Strategy
                                        <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full uppercase">NLP Processing</span>
                                    </h3>
                                    <AuditCard 
                                        title="Value Prop" 
                                        status="info" 
                                        description={auditData.marketing.valueProposition} 
                                        techSource="Análisis de Procesamiento de Lenguaje Natural sobre el Hero Section y Meta-tags."
                                    />
                                    <AuditCard 
                                        title="VIP Rec" 
                                        status="critical" 
                                        description={auditData.marketing.vipRecommendation} 
                                        techSource="Algoritmo heurístico basado en patrones de conversión para E-commerce."
                                    />
                                </div>
                            </div>

                            {/* 3. BLOQUE DE METODOLOGÍA (Transparencia de Scoring) */}
                            <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                    <Info size={16} /> Metodología de Scoring Vertex v1.0
                                </h4>
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    El puntaje final se calcula mediante una media ponderada: 
                                    <span className="font-mono font-bold mx-1">Score = (Tech * 0.4) + (Mkt * 0.3) + (Trust * 0.3)</span>. 
                                    Este modelo prioriza el rendimiento técnico como base de la retención de usuarios.
                                </p>
                            </div>

                            {/* Lead Magnet */}
                            <div className="bg-slate-900 rounded-2xl p-8 text-white">
                                <h3 className="text-xl font-bold mb-4">Send Full Report to Inbox</h3>
                                <form onSubmit={sendReportToMake} className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        placeholder="email@example.com"
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || emailSent}
                                        className={`px-8 py-3 rounded-xl font-bold transition-all ${emailSent ? 'bg-emerald-500' : 'bg-white text-slate-900'}`}
                                    >
                                        {isSending ? <Loader2 className="animate-spin" size={18} /> : emailSent ? <Check size={18} /> : "Send Report"}
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
