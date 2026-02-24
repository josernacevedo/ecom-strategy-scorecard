import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, Check, CheckCircle } from 'lucide-react';
import { performSimulatedAudit } from './services/audit';

function App() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    // Función para determinar el estado según el LCP de Google Core Web Vitals
    const getLCPStatus = (lcpString) => {
        const lcp = parseFloat(lcpString.replace('s', ''));
        if (lcp <= 2.5) return 'success'; // Verde: Bueno
        if (lcp <= 4.0) return 'warning'; // Naranja: Necesita mejora
        return 'critical'; // Rojo: Pobre
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
            const lcpValue = parseFloat(auditData.technical.loadSpeed.replace('s', ''));
            
            const payload = {
                email: email,
                url: url,
                technical_score: Math.round(auditData.score * 10),
                seo_score: auditData.technical.seoScore,
                platform: auditData.technical.platform,
                performance_data: {
                    LCP: auditData.technical.loadSpeed,
                    speed: lcpValue <= 2.5 ? 'Fast' : (lcpValue <= 4.0 ? 'Average' : 'Slow')
                },
                marketing_insights: {
                    value_prop: auditData.marketing.valueProposition,
                    tone: auditData.marketing.copyTone
                },
                growth_opportunity: auditData.marketing.vipRecommendation,
                revenue_impact: auditData.revenue_impact,
                roadmap: auditData.roadmap_30_days,
                metadata: {
                    date: new Date().toISOString(),
                    consultant: "Jose Serna Acevedo"
                }
            };
            
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            setEmailSent(true);
        } catch (error) {
            console.error("Failed to send report:", error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            <main className="lg:ml-64 flex-1 p-4 md:p-8 bg-white min-h-screen w-full">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Audit Dashboard</h2>
                        <p className="text-sm text-slate-500">Official Google Core Web Vitals Assessment.</p>
                    </div>

                    <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200 mb-6 md:mb-10">
                        <form onSubmit={handleAnalyze} className="max-w-2xl">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target URL</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <input
                                    type="url"
                                    placeholder="https://example.com"
                                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 outline-none"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    disabled={isAnalyzing}
                                />
                                <button
                                    type="submit"
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <span>Analyze</span>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {auditData && (
                        <div className="space-y-6 md:space-y-8 animate-fade-in">
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-900">Technical Insights</h3>
                                    <AuditCard title="Platform" status="success" description={`Detected ${auditData.technical.platform}.`} />
                                    {/* Aplicación de la lógica dinámica de Google */}
                                    <AuditCard 
                                        title="Performance (LCP)" 
                                        status={getLCPStatus(auditData.technical.loadSpeed)} 
                                        description={`Largest Contentful Paint: ${auditData.technical.loadSpeed}.`} 
                                    />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-900">Marketing Strategy</h3>
                                    <AuditCard title="Value Prop" status="info" description={auditData.marketing.valueProposition} />
                                    <AuditCard title="VIP Rec" status="critical" description={auditData.marketing.vipRecommendation} />
                                </div>
                            </div>

                            {/* Lead Magnet Section */}
                            <div className="mt-8 md:mt-12 bg-indigo-900 rounded-2xl p-6 md:p-8 text-white">
                                <h3 className="text-xl md:text-2xl font-bold mb-2">Get the Full Strategic Report</h3>
                                <p className="text-indigo-200 mb-6">Unlock deep analysis and ROI projections.</p>
                                <form onSubmit={sendReportToMake} className="flex flex-col sm:flex-row gap-3">
                                    <input
                                        type="email"
                                        required
                                        className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-indigo-500/30 text-white outline-none"
                                        placeholder="you@company.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSending || emailSent}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSending || emailSent}
                                        className={`px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${
                                            emailSent ? 'bg-emerald-500' : 'bg-white text-indigo-900'
                                        }`}
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
