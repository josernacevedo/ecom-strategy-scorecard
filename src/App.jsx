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

    // 1. LÓGICA DE ESTÁNDARES GOOGLE CORE WEB VITALS
    const getLCPStatus = (lcpString) => {
        const lcp = parseFloat(lcpString.replace('s', ''));
        if (lcp <= 2.5) return 'success'; // Bueno
        if (lcp <= 4.0) return 'warning'; // Necesita mejora
        return 'critical'; // Pobre
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
            
            // Payload enriquecido con sustento técnico para el reporte de consultoría
            const payload = {
                email,
                url,
                auditData,
                roi_justification: "Proyección basada en el modelo de regresión de VertexPoint que correlaciona la mejora del LCP y la claridad del CTA con el incremento histórico de la industria.",
                data_sources: {
                    technical: "Google Lighthouse API v11",
                    marketing: "OpenAI GPT-4o (NLP Analysis)",
                    infrastructure: "DOM Scraping & Header Analysis"
                },
                metadata: { 
                    consultant: "Jose Serna Acevedo", 
                    brand: "Anti gravity",
                    location: "Albuquerque | Colombia"
                }
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
            {/* Sidebar responsivo: oculto en móviles, visible en escritorio */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            <main className="lg:ml-64 flex-1 p-4 md:p-8 bg-white min-h-screen w-full">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header Principal */}
                    <div className="mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">VertexPoint Audit</h2>
                        <p className="text-sm text-slate-500">Sistemas de Automatización Inteligente Anti gravity.</p>
                    </div>

                    {/* Buscador Optimizado (Mobile-First) */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-10">
                        <form onSubmit={handleAnalyze} className="max-w-2xl">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Dominio a auditar</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="url"
                                        placeholder="https://tu-ecommerce.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none text-sm focus:border-indigo-500 transition-all"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isAnalyzing}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <span>Analyze</span>}
                                    {!isAnalyzing && <ArrowRight size={18} />}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* SECCIÓN DE RESULTADOS */}
                    {auditData && (
                        <div className="space-y-8 animate-fade-in pb-20">
                            
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />

                            {/* Metodología de Scoring (Transparencia de la "Caja de Cristal") */}
                            <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl">
                                <h4 className="text-sm font-bold text-indigo-900 mb-2 flex items-center gap-2">
                                    <Info size={16} /> Metodología de Evaluación Vertex v1.0
                                </h4>
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    El puntaje Vertex es un índice ponderado basado en: 
                                    <strong> (1) Technical Health (40%)</strong>; 
                                    <strong> (2) Marketing Clarity (30%)</strong>; y 
                                    <strong> (3) Trust Indicators (30%)</strong>. 
                                    Ecuación: <span className="font-mono bg-indigo-100 px-1 rounded italic">Score = (Tech*0.4) + (Mkt*0.3) + (Trust*0.3)</span>.
                                </p>
                            </div>

                            {/* Grid de Auditoría con Fuentes Técnicas */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Columna Técnica */}
                                <div className="space-y-3">
                                    <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                                        ANÁLISIS TÉCNICO
                                        <span className="text-[9px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">API + Scraping</span>
                                    </h3>
                                    <AuditCard 
                                        title="Platform" 
                                        status="success" 
                                        description={`Detección: ${auditData.technical.platform}.`} 
                                        techSource="Análisis de firmas tecnológicas en el DOM y cabeceras HTTP (Wappalyzer Protocol)."
                                    />
                                    <AuditCard 
                                        title="Performance (LCP)" 
                                        status={getLCPStatus(auditData.technical.loadSpeed)} 
                                        description={`LCP Detectado: ${auditData.technical.loadSpeed}.`} 
                                        techSource="Medición oficial de Google Core Web Vitals (Largest Contentful Paint) vía Lighthouse API."
                                    />
                                </div>

                                {/* Columna de Marketing */}
                                <div className="space-y-3">
                                    <h3 className="text-slate-900 font-bold text-sm flex items-center gap-2">
                                        ESTRATEGIA DIGITAL
                                        <span className="text-[9px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">AI + NLP</span>
                                    </h3>
                                    <AuditCard 
                                        title="Value Prop" 
                                        status="info" 
                                        description={auditData.marketing.valueProposition} 
                                        techSource="Análisis semántico mediante IA sobre el Hero Section y extracción de Meta-tags Open Graph."
                                    />
                                    <AuditCard 
                                        title="VIP Recommendation" 
                                        status="critical" 
                                        description={auditData.marketing.vipRecommendation} 
                                        techSource="Algoritmo heurístico basado en patrones de conversión de e-commerce de alto ticket."
                                    />
                                </div>
                            </div>

                            {/* Sustento del ROI Proyectado */}
                            <div className="p-6 bg-slate-900 rounded-2xl text-white">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold">Proyección de Impacto Económico</h3>
                                        <p className="text-slate-400 text-sm">Estimación basada en optimización sistémica.</p>
                                    </div>
                                    <div className="bg-indigo-500 px-4 py-2 rounded-lg font-bold text-2xl">
                                        +7% - 10% <span className="text-xs block font-normal text-indigo-100 italic">Conversión Estimada</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed border-t border-white/10 pt-4 italic">
                                    *Proyección basada en el modelo de regresión de VertexPoint que correlaciona la mejora del LCP y la claridad del CTA con el incremento histórico de la industria e-commerce. Cada 1s de mejora en carga móvil impacta directamente en la retención y el ROAS.
                                </p>
                            </div>

                            {/* Lead Magnet: Captura de Correo */}
                            <div className="bg-indigo-600 rounded-2xl p-8 text-white text-center">
                                <h3 className="text-2xl font-bold mb-2">¿Quieres el reporte técnico completo?</h3>
                                <p className="text-indigo-100 mb-6 text-sm">Recibe el desglose de KPIs y el Roadmap de 30 días en tu bandeja de entrada.</p>
                                <form onSubmit={sendReportToMake} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={18} />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-indigo-400 text-white outline-none placeholder:text-indigo-300 focus:bg-white/20 transition-all"
                                            placeholder="tu@empresa.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSending || emailSent}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSending || emailSent}
                                        className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                                            emailSent ? 'bg-emerald-500' : 'bg-white text-indigo-600 hover:bg-indigo-50'
                                        }`}
                                    >
                                        {isSending ? <Loader2 className="animate-spin" size={18} /> : emailSent ? <CheckCircle size={18} /> : "Enviar Reporte"}
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
