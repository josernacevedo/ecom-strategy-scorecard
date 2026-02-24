import React from 'react';
import { Info, AlertCircle, CheckCircle, InfoIcon } from 'lucide-react';

const AuditCard = ({ title, status, description, techSource }) => {
  const statusStyles = {
    success: 'border-emerald-100 bg-emerald-50 text-emerald-700',
    warning: 'border-amber-100 bg-amber-50 text-amber-700',
    critical: 'border-rose-100 bg-rose-50 text-rose-700',
    info: 'border-blue-100 bg-blue-50 text-blue-700',
  };

  const iconStyles = {
    success: <CheckCircle size={16} className="text-emerald-500" />,
    warning: <AlertCircle size={16} className="text-amber-500" />,
    critical: <AlertCircle size={16} className="text-rose-500" />,
    info: <InfoIcon size={16} className="text-blue-500" />,
  };

  return (
    <div className={`relative group p-4 rounded-xl border ${statusStyles[status]} transition-all hover:shadow-sm`}>
      <div className="flex justify-between items-start mb-1">
        <span className="text-xs font-bold uppercase tracking-wider opacity-70 flex items-center gap-1">
          {title}
          {/* Tooltip de Transparencia Técnica */}
          <div className="relative flex items-center">
            <Info size={12} className="cursor-help text-slate-400 hover:text-slate-600" />
            <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg shadow-xl z-50 leading-tight font-normal normal-case">
              <span className="block font-bold mb-1 border-bottom border-slate-600">Origen del Dato:</span>
              {techSource}
            </div>
          </div>
        </span>
        {iconStyles[status]}
      </div>
      <p className="text-sm font-medium leading-tight">{description}</p>
    </div>
  );
};

export default AuditCard;
