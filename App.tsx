
import React, { useState, useEffect } from 'react';
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

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('flat_money_data');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados", e);
      }
    }
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (data.length > 0 || localStorage.getItem('flat_money_data')) {
      localStorage.setItem('flat_money_data', JSON.stringify(data));
      setLastSaved(Date.now());
    }
  }, [data]);

  const handleSaveMonth = (newMonth: MonthData) => {
    if (editingMonth) {
      setData(data.map(m => m.id === newMonth.id ? newMonth : m));
    } else {
      setData([...data, newMonth]);
    }
    setView('dashboard');
    setEditingMonth(undefined);
  };

  const handleEdit = (month: MonthData) => {
    setEditingMonth(month);
    setView('form');
  };

  const handleDelete = (id: string) => {
    if (confirm("Deseja realmente apagar este registro? Esta ação não pode ser desfeita.")) {
      setData(data.filter(m => m.id !== id));
    }
  };

  const openInsight = (month: MonthData) => {
    setInsightMonth(month);
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50">
      <Header setView={setView} activeView={view} lastSaved={lastSaved} />
      
      <main className="max-w-6xl mx-auto px-4 pt-24">
        {view === 'dashboard' && <Dashboard data={data} />}
        
        {view === 'form' && (
          <FinancialForm 
            onSave={handleSaveMonth} 
            onCancel={() => { setView('dashboard'); setEditingMonth(undefined); }} 
            initialData={editingMonth}
          />
        )}

        {view === 'list' && (
          <MonthList 
            data={data} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            onInsight={openInsight}
          />
        )}

        {view === 'sync' && (
          <SyncSettings 
            data={data} 
            onImport={(newData) => { setData(newData); setView('dashboard'); }} 
          />
        )}
      </main>

      {/* Botão Flutuante Principal */}
      {view !== 'form' && view !== 'sync' && (
        <button 
          onClick={() => { setEditingMonth(undefined); setView('form'); }}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white px-6 h-14 rounded-2xl shadow-2xl flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all z-40 font-bold print:hidden"
        >
          <i className="fa-solid fa-plus text-xl"></i>
          <span className="hidden sm:inline">Novo Mês</span>
        </button>
      )}

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
