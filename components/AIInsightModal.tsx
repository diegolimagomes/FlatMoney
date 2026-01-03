
import React, { useState, useEffect } from 'react';
import { MonthData } from '../types';
import { getFinancialInsight } from '../services/geminiService';

interface AIInsightModalProps {
  month: MonthData;
  onClose: () => void;
}

const AIInsightModal: React.FC<AIInsightModalProps> = ({ month, onClose }) => {
  const [insight, setInsight] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoading(true);
      const text = await getFinancialInsight(month);
      setInsight(text || '');
      setLoading(false);
    };
    fetchInsight();
  }, [month]);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[60] p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 p-8 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/30 animate-pulse">
              <i className="fa-solid fa-wand-magic-sparkles text-xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Análise da IA</h2>
              <p className="text-indigo-100/70 text-sm font-medium">{month.month} de {month.year}</p>
            </div>
          </div>
        </div>
        
        <div className="p-8 sm:p-10">
          {loading ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-full w-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-100 rounded-full w-5/6 animate-pulse"></div>
                <div className="h-4 bg-slate-100 rounded-full w-2/3 animate-pulse"></div>
              </div>
              <div className="pt-6 flex flex-col items-center">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Consultando o Gemini...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="prose prose-slate text-slate-600 leading-relaxed text-base italic font-medium">
                <i className="fa-solid fa-quote-left text-indigo-200 text-3xl mb-2 block"></i>
                {insight}
              </div>
              <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
                <i className="fa-solid fa-circle-info mr-1"></i>
                Análise baseada em valores registrados
              </p>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-lg shadow-slate-200 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Fechar Análise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsightModal;
