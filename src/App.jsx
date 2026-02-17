import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, CheckCircle, AlertCircle, Check, Menu } from 'lucide-react';
import { performSimulatedAudit } from './services/audit';

function App() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditData, setAuditData] = useState(null);
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sendError, setSendError] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url) return;
        setIsAnalyzing(true);
        setAuditData(null);
        setEmailSent(false);
        setSendError(null);
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
        setSendError(null);
        try {
            const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_URL;
            const payload = {
                email: email,
                url: url,
                technical_score: Math.round(auditData.score * 10),
                seo_score: auditData.technical.seoScore,
                trust_score: 95,
                platform: auditData.technical.platform,
                performance_data: {
                    LCP: auditData.technical.loadSpeed,
                    speed: auditData.technical.loadSpeed.replace('s', '') < 2 ? 'Fast' : 'Slow'
                },
                marketing_insights: {
                    value_prop: auditData.marketing.valueProposition,
                    tone: auditData.marketing.copyTone
                },
                growth_opportunity: auditData.marketing.vipRecommendation,
                revenue_impact: auditData.revenue_impact,
                trust_checklist: auditData.trust_checklist,
                roadmap: auditData.roadmap_30_days,
                metadata: {
                    date: new Date().toISOString(),
                    consultant: "Jose Serna Acevedo"
                }
            };
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            if (!response.ok) throw new Error('Network response was not ok');
            setEmailSent(true);
        } catch (error) {
            setSendError("Failed to send report. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Sidebar oculto en móvil, visible en escritorio */}
            <div className="hidden lg:block">
                <Sidebar />
            </div>

            {/* Ajuste de margen principal responsive */}
            <main className="lg:ml-64 flex-1 p-4 md:p-8 bg-white min-h-screen w-full">
                <div className="max-w-5xl mx-auto">
                    
                    {/* Header con espaciado móvil */}
                    <div className="mb-6 md:mb-8">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-900">Audit Dashboard</h2>
                        <p className="text-sm text-slate-500">Welcome back. Ready to analyze a new competitor?</p>
                    </div>

                    {/* Search Hero Adaptable */}
                    <div className="bg-slate-50 p-4 md:p-6 rounded-2xl border border-slate-200 mb-6 md:mb-10">
                        <form onSubmit={handleAnalyze} className="max-w-2xl">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target URL</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="url"
                                        placeholder="https://example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 outline-none text-sm md:text-base"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isAnalyzing}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors w-full sm:w-auto"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <span>Analyze</span>}
                                    {!isAnalyzing && <ArrowRight size={18} />}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Results Section */}
                    {auditData && (
                        <div className="space-y-6 md:space-y-8 animate-fade-in">
                            <MetricHeader score={auditData.score} seoScore={auditData.technical.seoScore} />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">Technical Insights</h3>
                                    <AuditCard title="Platform" status="success" description={`Detected ${auditData.technical.platform}.`} />
                                    <AuditCard title="Performance" status="warning" description={`LCP: ${auditData.technical.loadSpeed}.`} />
                                </div>
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-slate-900 flex items-center gap-2">Marketing Strategy</h3>
                                    <AuditCard title="Value Prop" status="info" description={auditData.marketing.valueProposition} />
                                    <AuditCard title="VIP Rec" status="critical" description={auditData.marketing.vipRecommendation} />
                                </div>
                            </div>

                            {/* Lead Magnet Responsive */}
                            <div className="mt-8 md:mt-12 bg-indigo-900 rounded-2xl p-6 md:p-8 text-white">
                                <h3 className="text-xl md:text-2xl font-bold mb-2">Get the Full Strategic Report</h3>
                                <p className="text-indigo-200 text-sm md:text-base mb-6">Unlock 15+ data points delivered to your inbox.</p>
                                <form onSubmit={sendReportToMake} className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
                                        <input
                                            type="email"
                                            required
                                            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-indigo-500/30 text-white outline-none"
                                            placeholder="you@company.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSending || emailSent}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSending || emailSent}
                                        className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto ${
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
