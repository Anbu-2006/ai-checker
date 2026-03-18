import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ModelSetup from './pages/ModelSetup';
import Comparison from './pages/Comparison';
import History from './pages/History';
import Reports from './pages/Reports';
import Architecture from './pages/Architecture';

const pages: Record<string, React.FC<any>> = {
  dashboard: Dashboard,
  models: ModelSetup,
  comparison: Comparison,
  history: History,
  reports: Reports,
  architecture: Architecture,
};

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [modelCount, setModelCount] = useState(0);
  
  useEffect(() => {
    const checkModels = () => {
      try {
        const saved = localStorage.getItem('aiModels');
        const count = saved ? JSON.parse(saved).length : 0;
        setModelCount(count);
      } catch {
        setModelCount(0);
      }
    };
    
    checkModels();
    const interval = setInterval(checkModels, 1000);
    return () => clearInterval(interval);
  }, []);

  const PageComponent = pages[activePage] || Dashboard;

  return (
    <div className="min-h-screen bg-[#0a0f1e] bg-grid-pattern">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}
        />
      </div>

      <Sidebar activePage={activePage} onNavigate={setActivePage} />

      {/* Main Content */}
      <main className="ml-[240px] relative z-10">
        {/* Top Bar */}
        <header
          className="sticky top-0 z-40 h-16 flex items-center justify-between px-6"
          style={{
            background: 'rgba(10,15,30,0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(139,92,246,0.08)',
          }}
        >
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
              <span>NeuralBench</span>
              <span>/</span>
              <span className="text-slate-300 capitalize">{activePage === 'models' ? 'Model Setup' : activePage === 'architecture' ? 'Architecture' : activePage}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/50 border border-white/5">
              <div className={`w-2 h-2 rounded-full metric-indicator ${modelCount > 0 ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              <span className="text-xs text-slate-400">
                {modelCount} {modelCount === 1 ? 'model' : 'models'} connected
              </span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
            >
              NB
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <PageComponent onNavigate={setActivePage} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
