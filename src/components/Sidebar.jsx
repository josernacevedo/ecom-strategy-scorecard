import React from 'react';
import { LayoutDashboard, Search, FileText, Settings, User } from 'lucide-react';

export default function Sidebar() {
    return (
        <div className="w-64 bg-slate-50 border-r border-slate-200 h-screen flex flex-col p-4 fixed left-0 top-0">
            <div className="mb-8 px-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Vertex<span className="text-indigo-600">Point</span></h1>
                <p className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">Audit & Strategy</p>
            </div>

            <nav className="flex-1 space-y-1">
                <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
                <NavItem icon={<Search size={20} />} label="New Audit" />
                <NavItem icon={<FileText size={20} />} label="Reports" />
                <NavItem icon={<User size={20} />} label="Clients" />
            </nav>

            <div className="pt-4 border-t border-slate-200">
                <NavItem icon={<Settings size={20} />} label="Settings" />
            </div>
        </div>
    );
}

function NavItem({ icon, label, active = false }) {
    return (
        <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}>
            {icon}
            <span>{label}</span>
        </button>
    );
}
