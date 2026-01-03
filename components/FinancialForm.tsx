
import React, { useState } from 'react';
import { MonthData } from '../types';
import { monthsList } from '../utils/calculations';

interface FinancialFormProps {
  onSave: (data: MonthData) => void;
  onCancel: () => void;
  initialData?: MonthData;
}

const FinancialForm: React.FC<FinancialFormProps> = ({ onSave, onCancel, initialData }) => {
  const formatBRLInput = (value: number | string): string => {
    const num = typeof value === 'string' ? (parseFloat(value.replace(/\D/g, '')) / 100 || 0) : value;
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const parseToNumber = (formattedValue: string): number => {
    return parseFloat(formattedValue.replace(/\D/g, '')) / 100 || 0;
  };

  const [month, setMonth] = useState(initialData?.month || monthsList[new Date().getMonth()]);
  const [year, setYear] = useState(initialData?.year || new Date().getFullYear());
  const [revenueStr, setRevenueStr] = useState<string>(formatBRLInput(initialData?.revenue || 0));
  const [adminFeePercent, setAdminFeePercent] = useState(initialData?.adminFeePercent || 35);
  
  const [expenses, setExpenses] = useState<{ id: string, description: string, amountStr: string }[]>(
    initialData?.expenses.map(ex => ({
      id: ex.id,
      description: ex.description,
      amountStr: formatBRLInput(ex.amount)
    })) || []
  );

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now().toString(), description: '', amountStr: '0,00' }]);
  };

  const updateExpense = (index: number, field: 'description' | 'amountStr', value: string) => {
    const updated = [...expenses];
    if (field === 'amountStr') {
      updated[index].amountStr = formatBRLInput(value);
    } else {
      updated[index].description = value;
    }
    setExpenses(updated);
  };

  const removeExpense = (index: number) => {
    setExpenses(expenses.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialData?.id || Date.now().toString(),
      month,
      year,
      revenue: parseToNumber(revenueStr),
      expenses: expenses.map(ex => ({
        id: ex.id,
        description: ex.description,
        amount: parseToNumber(ex.amountStr)
      })),
      adminFeePercent,
      partnersCount: 1, // Fixado em 1 conforme simplificação pedida
      createdAt: initialData?.createdAt || Date.now()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-100 max-w-2xl mx-auto animate-fadeIn">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
          <i className="fa-solid fa-calendar-plus text-xl"></i>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {initialData ? 'Editar Lançamento' : 'Lançamento Mensal'}
          </h2>
          <p className="text-slate-400 text-sm">Registre o faturamento e gastos oficiais.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mês</label>
          <select 
            value={month} 
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          >
            {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Ano</label>
          <input 
            type="number" 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
          />
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Receita Bruta (Airbnb)</label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
          <input 
            type="text" 
            inputMode="numeric"
            value={revenueStr} 
            onChange={(e) => setRevenueStr(formatBRLInput(e.target.value))}
            className="w-full p-4 pl-12 bg-slate-50 border border-slate-200 rounded-xl font-black text-emerald-600 text-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="0,00"
            required
          />
        </div>
      </div>

      <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-200/50">
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold text-slate-500 uppercase">Lista de Gastos</label>
          <button 
            type="button" 
            onClick={addExpense}
            className="text-xs font-bold bg-white text-indigo-600 px-4 py-2 rounded-xl shadow-sm border border-slate-200 hover:bg-indigo-50 transition-colors"
          >
            <i className="fa-solid fa-plus mr-1"></i> Adicionar
          </button>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {expenses.map((expense, index) => (
            <div key={expense.id} className="flex gap-2 items-center bg-white p-2 rounded-xl border border-slate-100 shadow-sm animate-fadeIn">
              <input 
                type="text" 
                placeholder="Ex: Luz, Limpeza..."
                value={expense.description}
                onChange={(e) => updateExpense(index, 'description', e.target.value)}
                className="flex-1 p-2.5 bg-transparent text-sm focus:outline-none"
                required
              />
              <div className="relative w-36 shrink-0">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">R$</span>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={expense.amountStr}
                  onChange={(e) => updateExpense(index, 'amountStr', e.target.value)}
                  className="w-full p-2.5 pl-8 pr-3 bg-slate-50 border border-slate-100 rounded-lg text-sm font-bold text-rose-500 focus:ring-2 focus:ring-rose-200 outline-none text-right"
                  required
                />
              </div>
              <button type="button" onClick={() => removeExpense(index)} className="w-8 text-slate-300 hover:text-rose-500 transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Taxa de Administração (%)</label>
        <div className="relative">
          <input 
            type="number" 
            value={adminFeePercent} 
            onChange={(e) => setAdminFeePercent(parseInt(e.target.value) || 0)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button type="button" onClick={onCancel} className="order-2 sm:order-1 flex-1 py-4 text-slate-500 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50">Cancelar</button>
        <button type="submit" className="order-1 sm:order-2 flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Salvar Fechamento</button>
      </div>
    </form>
  );
};

export default FinancialForm;
