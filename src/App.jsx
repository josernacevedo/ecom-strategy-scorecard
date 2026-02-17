import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MetricHeader from './components/MetricHeader';
import AuditCard from './components/AuditCard';
import { Search, ArrowRight, Loader2, Mail, CheckCircle, AlertCircle, Check } from 'lucide-react';
import { performSimulatedAudit } from './services/audit';

function App() {
    const [url, setUrl] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [auditData, setAuditData] = useState(null);

    // Email Capture State
    const [email, setEmail] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [sendError, setSendError] = useState(null);

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!url) return;

        setIsAnalyzing(true);
        setAuditData(null);
        setEmailSent(false); // Reset email state on new audit
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

            if (!webhookUrl) {
                throw new Error("Webhook URL not configured.");
            }

            const payload = {
                user_email: email,
                competitor_url: url,
                tech_data: auditData.technical,
                marketing_insights: auditData.marketing,
                score: auditData.score
            };

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setEmailSent(true);
        } catch (error) {
            console.error("Failed to send report:", error);
            setSendError("Failed to send report. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />

            <main className="ml-64 flex-1 p-8 bg-white min-h-screen">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900">Audit Dashboard</h2>
                        <p className="text-slate-500">Welcome back. Ready to analyze a new competitor?</p>
                    </div>

                    {/* Search Hero */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-10 transition-all">
                        <form onSubmit={handleAnalyze} className="max-w-2xl">
                            <label className="block text-sm font-medium text-slate-700 mb-2">Target URL</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                    <input
                                        type="url"
                                        placeholder="https://example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder:text-slate-400 disabled:opacity-50"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        disabled={isAnalyzing}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isAnalyzing}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={18} /> : <span>Analyze</span>}
                                    {!isAnalyzing && <ArrowRight size={18} />}
                                </button>
                            </div>
                        </form>

                        {isAnalyzing && (
                            <div className="mt-4 flex items-center gap-2 text-indigo-600 animate-pulse">
                                <Loader2 size={16} className="animate-spin" />
                                <span className="text-sm font-medium">Analizando sitio del competidor...</span>
                            </div>
                        )}
                    </div>

                    {/* Results Section */}
                    {auditData && (
                        <div className="animate-fade-in space-y-8">
                            {/* Key Metrics */}
                            <MetricHeader
                                score={auditData.score}
                                seoScore={auditData.technical.seoScore}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Technical Findings */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                        Technical Insights
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider">Tech</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <AuditCard
                                            title="E-commerce Platform"
                                            status="success"
                                            description={`Detected ${auditData.technical.platform} implementation.`}
                                        />
                                        <AuditCard
                                            title="Load Performance"
                                            status={auditData.technical.loadSpeed.replace('s', '') < 2 ? 'success' : 'warning'}
                                            description={`Site loads in ${auditData.technical.loadSpeed} (LCP).`}
                                        />
                                        <AuditCard
                                            title="SEO Foundation"
                                            status="warning"
                                            description={`Score: ${auditData.technical.seoScore}/100. Some meta tags may be improved.`}
                                        />
                                    </div>
                                </div>

                                {/* Marketing Strategy */}
                                <div>
                                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                        Marketing Strategy
                                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-[10px] uppercase font-bold tracking-wider">Strategy</span>
                                    </h3>
                                    <div className="space-y-3">
                                        <AuditCard
                                            title="Value Proposition"
                                            status="info"
                                            description={auditData.marketing.valueProposition}
                                        />
                                        <AuditCard
                                            title="Copy Tone"
                                            status="info"
                                            description={auditData.marketing.copyTone}
                                        />
                                        <AuditCard
                                            title="Growth Opportunity (VIP)"
                                            status="critical" // Highlighting the recommendation
                                            description={auditData.marketing.vipRecommendation}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Lead Magnet / Email Capture */}
                            <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>

                                <div className="relative z-10 max-w-2xl">
                                    <h3 className="text-2xl font-bold mb-2">Get the Full Strategic Report</h3>
                                    <p className="text-indigo-200 mb-6">
                                        Unlock 15+ additional data points and a step-by-step optimization plan delivered to your inbox.
                                    </p>

                                    <form onSubmit={sendReportToMake} className="flex gap-3">
                                        <div className="relative flex-1">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300" size={20} />
                                            <input
                                                type="email"
                                                required
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-indigo-500/30 text-white placeholder:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all disabled:opacity-50"
                                                placeholder="you@company.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                disabled={isSending || emailSent}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSending || emailSent}
                                            className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-100 min-w-[140px] justify-center ${emailSent
                                                ? 'bg-emerald-500 text-white hover:bg-emerald-500 cursor-default'
                                                : 'bg-white text-indigo-900 hover:bg-indigo-50'
                                                }`}
                                        >
                                            {isSending ? (
                                                <Loader2 className="animate-spin" size={18} />
                                            ) : emailSent ? (
                                                <>
                                                    <Check size={18} />
                                                    <span>Sent!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Send Report</span>
                                                    <ArrowRight size={18} />
                                                </>
                                            )}
                                        </button>
                                    </form>

                                    {sendError && (
                                        <div className="mt-3 flex items-center gap-2 text-red-300 text-sm">
                                            <AlertCircle size={16} />
                                            <span>{sendError}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                        </div>
                    )}

                    {/* Placeholder when no data */}
                    {!auditData && !isAnalyzing && (
                        <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                            <p className="text-slate-400 font-medium">Enter a URL above to start the agentic audit.</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default App;
