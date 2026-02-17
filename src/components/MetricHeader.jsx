import React from 'react';
import { TrendingUp, Activity, CheckCircle } from 'lucide-react';

export default function MetricHeader({ score, seoScore }) {
    // Default values for initial render
    const displayScore = score ? Math.round(score * 10) : 0; // Convert 8.8 to 88
    const displaySeo = seoScore || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <MetricCard
                title="Technical Score"
                value={`${displayScore}/100`}
                trend="+12%"
                icon={<Activity className="text-indigo-600" size={20} />}
            />
            <MetricCard
                title="SEO Health"
                value={`${displaySeo}%`}
                trend="+5%"
                icon={<TrendingUp className="text-emerald-500" size={20} />}
            />
            <MetricCard
                title="Trust Signals"
                value="High"
                trend="Stable"
                icon={<CheckCircle className="text-blue-500" size={20} />}
            />
        </div>
    );
}

function MetricCard({ title, value, trend, icon }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-500 text-xs font-medium uppercase tracking-wide">{title}</span>
                    {icon}
                </div>
                <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-slate-900">{value}</span>
                    <span className="text-xs font-medium text-emerald-600 mb-1">{trend}</span>
                </div>
            </div>

            {/* Sparkline Background */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 group-hover:opacity-20 transition-opacity">
                <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
                    <path
                        d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 18 L90 10 L100 12 V40 H0 Z"
                        fill="currentColor"
                        className="text-emerald-500"
                    />
                    <path
                        d="M0 35 L10 32 L20 34 L30 25 L40 28 L50 20 L60 22 L70 15 L80 18 L90 10 L100 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-emerald-500"
                    />
                </svg>
            </div>
        </div>
    );
}
