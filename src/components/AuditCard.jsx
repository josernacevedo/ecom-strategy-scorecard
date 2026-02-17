import React from 'react';
import { AlertCircle, Check, X } from 'lucide-react';

export default function AuditCard({ title, status, description }) {
    const getStatusConfig = (s) => {
        switch (s) {
            case 'critical': return { icon: <X size={14} />, color: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-100', label: 'Critical', badgeText: 'text-slate-900' };
            case 'warning': return { icon: <AlertCircle size={14} />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', label: 'Warning', badgeText: 'text-slate-900' };
            case 'success': return { icon: <Check size={14} />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', label: 'Optimized', badgeText: 'text-slate-900' };
            default: return { icon: <AlertCircle size={14} />, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100', label: 'Info', badgeText: 'text-slate-900' };
        }
    };

    const config = getStatusConfig(status);

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-md ${config.bg} ${config.color}`}>
                        {config.icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
                        <p className="text-slate-500 text-sm mt-1">{description}</p>
                    </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.badgeText} ${config.border}`}>
                    {config.label}
                </span>
            </div>
        </div>
    );
}
