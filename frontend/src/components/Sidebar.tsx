import { useState } from 'react';
import {
  LayoutDashboard,
  Plug,
  GitCompareArrows,
  History,
  FileDown,
  Server,
  ChevronLeft,
  ChevronRight,
  Zap,
  Settings,
  Bell,
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'models', label: 'Model Setup', icon: Plug },
  { id: 'comparison', label: 'Comparison', icon: GitCompareArrows },
  { id: 'history', label: 'History', icon: History },
  { id: 'reports', label: 'Reports', icon: FileDown },
  { id: 'architecture', label: 'Architecture', icon: Server },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-[72px]' : 'w-[240px]'
      }`}
      style={{
        background: 'linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(10,15,30,0.98) 100%)',
        borderRight: '1px solid rgba(139,92,246,0.1)',
        backdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-white/5">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <Zap className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="font-heading text-lg font-bold gradient-text leading-tight">NeuralBench</h1>
            <p className="text-[10px] text-slate-500 tracking-wider uppercase">AI Benchmarking</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'sidebar-link-active text-white'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 py-4 border-t border-white/5 space-y-1">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all">
          <Bell className="w-[18px] h-[18px] text-slate-500" />
          {!collapsed && <span>Notifications</span>}
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all">
          <Settings className="w-[18px] h-[18px] text-slate-500" />
          {!collapsed && <span>Settings</span>}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] transition-all"
        >
          {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
