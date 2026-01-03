
import React from 'react';

interface HeaderProps {
  setView: (view: 'dashboard' | 'form' | 'list' | 'sync') => void;
  activeView: string;
  lastSaved: number | null;
}

const Header: React.FC<HeaderProps> = ({ setView, activeView, lastSaved }) => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-100 z-50 print:hidden">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
            <i className="fa-solid fa-building-circle-check"></i>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-lg leading-none tracking-tight text-slate-800">FlatMoney</span>
            {lastSaved && (
              <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>
                Salvo {new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        <nav className="flex bg-slate-100 p-1 rounded-xl scale-90 sm:scale-100">
          <button 
            onClick={() => setView('dashboard')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeView === 'dashboard' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Resumo
          </button>
          <button 
            onClick={() => setView('list')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${activeView === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Histórico
          </button>
        </nav>

        <button 
          onClick={() => setView('sync')}
          title="Sincronização e Backups"
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${activeView === 'sync' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
        >
          <i className="fa-solid fa-cloud-arrow-up"></i>
        </button>
      </div>
    </header>
  );
};

export default Header;
