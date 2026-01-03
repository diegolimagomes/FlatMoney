
import React from 'react';
import { MonthData } from '../types';
import { calculateSummary, formatCurrency } from '../utils/calculations';

interface MonthListProps {
  data: MonthData[];
  onEdit: (month: MonthData) => void;
  onDelete: (id: string) => void;
  onInsight: (month: MonthData) => void;
}

const MonthList: React.FC<MonthListProps> = ({ data, onEdit, onDelete, onInsight }) => {
  const sortedData = [...data].sort((a, b) => b.createdAt - a.createdAt);

  if (data.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Nenhum registro encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Histórico de Lançamentos</h2>
      {sortedData.map(month => {
        const summary = calculateSummary(month);
        return (
          <div key={month.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-slate-800">{month.month} {month.year}</span>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">Airbnb</span>
              </div>
              <div className="flex gap-4">
                <div className="text-xs">
                  <span className="text-slate-400 block">Faturamento</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(summary.totalRevenue)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 block">Lucro</span>
                  <span className="font-bold text-indigo-600">{formatCurrency(summary.netProfit)}</span>
                </div>
                <div className="text-xs">
                  <span className="text-slate-400 block">Por Sócio</span>
                  <span className="font-bold text-slate-700">{formatCurrency(summary.perPartnerAmount)}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 border-t md:border-t-0 pt-4 md:pt-0">
              <button 
                onClick={() => onInsight(month)}
                className="flex-1 md:flex-none px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                Analisar
              </button>
              <button 
                onClick={() => onEdit(month)}
                className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <i className="fa-solid fa-pen-to-square"></i>
              </button>
              <button 
                onClick={() => onDelete(month.id)}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MonthList;
