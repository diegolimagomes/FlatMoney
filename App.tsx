
import React, { useState, useEffect, useCallback } from 'react';
import { MonthData } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import FinancialForm from './components/FinancialForm';
import MonthList from './components/MonthList';
import AIInsightModal from './components/AIInsightModal';
import SyncSettings from './components/SyncSettings';

const App: React.FC = () => {
  const [data, setData] = useState<MonthData[]>([]);
  const [view, setView] = useState<'dashboard' | 'form' | 'list' | 'sync'>('dashboard');
  const [editingMonth, setEditingMonth] = useState<MonthData | undefined>(undefined);
  const [insightMonth, setInsightMonth] = useState<MonthData | null>(null);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  
  // Estados de Controle de Fluxo
  const [isLoading, setIsLoading] = useState(true);
  const [appError, setAppError] = useState<string | null>(null);

  // Inicialização Robusta
  useEffect(() => {
    const initApp = async () => {
      try {
        const saved = localStorage.getItem('flat_money_data');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setData(parsed);
          } else {
            throw new Error("Dados salvos em formato inválido.");
          }
        }
      } catch (e) {
        console.error("Erro crítico ao carregar banco de dados local:", e);
        setAppError("Não conseguimos carregar seus dados. Eles podem estar corrompidos no seu navegador.");
      } finally {
        // Simula um tempo mínimo para garantir que a UI não "pisque"
        setTimeout(() => setIsLoading(false), 800);
      }
    };

    initApp();
  }, []);

  // Salvamento Automático
  useEffect(() => {
    if (!isLoading && !appError) {
      try {
        localStorage.setItem('flat_money_data', JSON.stringify(data));
        setLastSaved(Date.now());
      } catch (e) {
        console.error("Erro ao salvar dados:", e);
      }
    }
  }, [data, isLoading, appError]);

  const handleSaveMonth = (newMonth: MonthData) => {
    if (editingMonth) {
      setData(prev => prev.map(m => m.id === newMonth.id ? newMonth : m));
    } else {
      setData(prev => [...prev, newMonth]);
    }
    setView('dashboard');
    setEditingMonth(undefined);
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente apagar este registro? Esta ação não pode ser desfeita.")) {
      setData(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleReset = useCallback(() => {
    if (confirm("Isso apagará TODO o histórico do seu navegador. Tem certeza?")) {
      localStorage.removeItem('flat_money_data');
      window.location.reload();
    }
  }, []);

  // Renderização de Estado: ERRO
  if (appError) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-[2.5rem] shadow-2xl border border-rose-100 animate-fadeIn">
          <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <i className="fa-solid fa-triangle-exclamation text-3xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">Ops! Algo deu errado</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">{appError}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all"
            >
              Tentar Novamente
            </button>
            <button 
              onClick={handleReset}
              className="w-full py-4 bg-white text-rose-500 font-bold rounded-2xl border border-rose-200 hover:bg-rose-50 transition-all"
            >
              Limpar Tudo e Recomeçar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Renderização de Estado: LOADING
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-xl shadow-indigo-100">
            <i className="fa-solid fa-building-circle-check text-2xl"></i>
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">FlatMoney</h2>
          <div className="mt-4 flex justify-center gap-1">
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900">
      <Header setView={setView} activeView={view} lastSaved={lastSaved} />
      
      <main className="max-w-6xl mx-auto px-4 pt-24 pb-12">
        {view === 'dashboard' && (
          <div className="animate-fadeIn">
            <Dashboard data={data} />
          </div>
        )}
        
        {view === 'form' && (
          <div className="animate-fadeIn">
            <FinancialForm 
              onSave={handleSaveMonth} 
              onCancel={() => { setView('dashboard'); setEditingMonth(undefined); }} 
              initialData={editingMonth}
            />
          </div>
        )}

        {view === 'list' && (
          <div className="animate-fadeIn">
            <MonthList 
              data={data} 
              onEdit={(month) => { setEditingMonth(month); setView('form'); }} 
              onDelete={handleDelete}
              onInsight={setInsightMonth}
            />
          </div>
        )}

        {view === 'sync' && (
          <div className="animate-fadeIn">
            <SyncSettings 
              data={data} 
              onImport={(newData) => { setData(newData); setView('dashboard'); }} 
            />
          </div>
        )}
      </main>

      {/* Botão Flutuante Principal */}
      {view !== 'form' && view !== 'sync' && (
        <button 
          onClick={() => { setEditingMonth(undefined); setView('form'); }}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white px-6 h-14 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all z-40 font-bold print:hidden"
        >
          <i className="fa-solid fa-plus text-xl"></i>
          <span className="hidden sm:inline">Lançar Mês</span>
        </button>
      )}

      {/* Modais */}
      {insightMonth && (
        <AIInsightModal 
          month={insightMonth} 
          onClose={() => setInsightMonth(null)} 
        />
      )}
    </div>
  );
};

export default App;
