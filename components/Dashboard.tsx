
import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { MonthData } from '../types';
import { calculateSummary, formatCurrency } from '../utils/calculations';

interface DashboardProps {
  data: MonthData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(true);

  const chartData = useMemo(() => {
    return data.slice().sort((a, b) => a.createdAt - b.createdAt).map(item => {
      const summary = calculateSummary(item);
      return {
        name: `${item.month.substring(0, 3)}/${item.year.toString().slice(-2)}`,
        Faturamento: summary.totalRevenue,
        Lucro: summary.netProfit
      };
    });
  }, [data]);

  const lastMonth = data.length > 0 ? data[data.length - 1] : null;
  const summary = lastMonth ? calculateSummary(lastMonth) : null;
  const isNegative = summary ? summary.netProfit < 0 : false;

  const pieData = summary ? [
    { name: 'Despesas', value: summary.totalExpenses, color: '#f43f5e' },
    { name: 'Taxa Adm', value: summary.adminFeeAmount, color: '#6366f1' },
    { name: 'Sócios', value: Math.max(0, summary.netProfit), color: '#10b981' }
  ] : [];

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(id);
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  const handlePrint = () => {
    // Tenta abrir a caixa de impressão. Se estiver em um navegador mobile/app, 
    // ele pode falhar silenciosamente, então mostramos um feedback.
    try {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        alert("Para salvar em PDF no celular:\n1. Clique nos 3 pontinhos do seu navegador\n2. Escolha 'Compartilhar'\n3. Selecione 'Imprimir'\n4. Salve como PDF");
      }
      window.print();
    } catch (e) {
      alert("Seu navegador bloqueou a abertura do PDF. Tente usar o menu 'Imprimir' do próprio navegador.");
    }
  };

  const copyFullReport = () => {
    if (!lastMonth || !summary) return;
    const report = `📊 *Resumo Flat - ${lastMonth.month}/${lastMonth.year}*

💰 *Faturamento:* ${formatCurrency(summary.totalRevenue)}
💸 *Despesas:* ${formatCurrency(summary.totalExpenses)}
🏢 *Taxa Adm:* ${formatCurrency(summary.adminFeeAmount)}
✅ *Lucro Final (Líquido):* ${formatCurrency(summary.netProfit)}

_Relatório FlatMoney_`;
    handleCopy(report, 'full-report');
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="text-6xl mb-4 text-slate-200">📊</div>
        <h3 className="text-xl font-semibold text-slate-600">Nenhum dado lançado ainda.</h3>
        <p className="text-slate-400 mt-2">Clique no botão "+" para começar a organizar as finanças.</p>
      </div>
    );
  }

  const SummaryCard = ({ title, value, colorClass, subtitle, id, copyValue }: any) => (
    <div className={`group relative bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:border-slate-300 transition-all ${isNegative && id === 'profit' ? 'bg-rose-50 ring-2 ring-rose-500/10' : ''}`}>
      <button 
        onClick={() => handleCopy(`${title}: ${copyValue}`, id)}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-lg transition-all print:hidden"
        title="Copiar valor"
      >
        <i className={`fa-solid ${copyFeedback === id ? 'fa-check text-emerald-500' : 'fa-copy'}`}></i>
      </button>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className={`text-2xl font-black ${colorClass}`}>{value}</h3>
      <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fadeIn printable-content pb-20">
      {/* Cabeçalho exclusivo para Impressão */}
      <div className="hidden print:flex items-center justify-between border-b-2 border-slate-800 pb-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl">
            <i className="fa-solid fa-building-circle-check"></i>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800">FlatMoney</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Relatório Financeiro Profissional</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-400 uppercase">Período</p>
          <p className="text-xl font-black text-slate-800">{lastMonth?.month} / {lastMonth?.year}</p>
        </div>
      </div>

      {/* Título e Ação de Compartilhamento na Tela */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Resumo de {lastMonth?.month}/{lastMonth?.year}</h2>
          <p className="text-sm text-slate-500">Visão geral do desempenho do seu flat.</p>
        </div>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-200 hover:bg-slate-700 active:scale-95 transition-all"
          >
            <i className="fa-solid fa-file-pdf"></i>
            Gerar PDF
          </button>
          <button 
            type="button"
            onClick={copyFullReport}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-100 hover:bg-emerald-600 active:scale-95 transition-all"
          >
            <i className={`fa-solid ${copyFeedback === 'full-report' ? 'fa-check' : 'fa-share-nodes'}`}></i>
            WhatsApp
          </button>
        </div>
      </div>

      {/* Resumo Rápido */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard 
          id="revenue"
          title="Faturamento (Airbnb)" 
          value={formatCurrency(summary?.totalRevenue || 0)} 
          colorClass="text-emerald-600"
          subtitle="Ganhos totais do flat"
          copyValue={formatCurrency(summary?.totalRevenue || 0)}
        />
        <SummaryCard 
          id="expenses"
          title="Total de Gastos" 
          value={formatCurrency(summary?.totalExpenses || 0)} 
          colorClass="text-rose-500"
          subtitle="Contas e manutenção"
          copyValue={formatCurrency(summary?.totalExpenses || 0)}
        />
        <SummaryCard 
          id="admin"
          title="Taxa de Administração" 
          value={formatCurrency(summary?.adminFeeAmount || 0)} 
          colorClass="text-indigo-600"
          subtitle="Comissão da gestão"
          copyValue={formatCurrency(summary?.adminFeeAmount || 0)}
        />
        <SummaryCard 
          id="profit"
          title="Lucro Final (Líquido)" 
          value={formatCurrency(summary?.netProfit || 0)} 
          colorClass={isNegative ? 'text-rose-600' : 'text-slate-800'}
          subtitle="O que sobrou no bolso"
          copyValue={formatCurrency(summary?.netProfit || 0)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Evolução */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 print:shadow-none print:border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-column text-indigo-500 print:hidden"></i>
            Evolução Mensal
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 11}}
                  tickFormatter={(val) => `R$ ${val >= 1000 ? (val / 1000).toFixed(1) + 'k' : val}`}
                />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold'}}
                  formatter={(value: number, name: string) => [formatCurrency(value), name]}
                />
                <Bar dataKey="Faturamento" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Lucro" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Divisão Gráfica */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 print:shadow-none print:border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <i className="fa-solid fa-chart-pie text-emerald-500 print:hidden"></i>
            Divisão do Bolo
          </h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter leading-none">Total</p>
              <p className="text-sm font-black text-slate-800">{formatCurrency(summary?.totalRevenue || 0)}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {pieData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-slate-500">{item.name}</span>
                </div>
                <span className="font-bold text-slate-700">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* DETALHAMENTO DO RELATÓRIO (Visível na tela e sempre no PDF) */}
      <div className={`mt-12 pt-8 border-t-2 border-slate-100 space-y-10 print:block ${showDetails ? 'block' : 'hidden'}`}>
        <div className="flex items-center justify-between print:hidden">
            <h3 className="text-xl font-black text-slate-800">Detalhamento das Contas</h3>
            <button onClick={() => setShowDetails(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600 underline">Ocultar na tela</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Tabela de Gastos Detalhada */}
          <div>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-receipt text-rose-500"></i>
              O que foi gasto este mês:
            </h3>
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-600">Descrição</th>
                    <th className="px-6 py-4 font-bold text-slate-600 text-right">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lastMonth?.expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 text-slate-700">{expense.description}</td>
                      <td className="px-6 py-4 text-slate-800 font-bold text-right">{formatCurrency(expense.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-black">
                  <tr>
                    <td className="px-6 py-5 text-slate-800 uppercase text-xs">Total em Despesas</td>
                    <td className="px-6 py-5 text-rose-600 text-right text-lg">{formatCurrency(summary?.totalExpenses || 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Resultado Final Detalhado */}
          <div>
            <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-check-double text-emerald-500"></i>
              Fechamento do Período
            </h3>
            <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-indigo-200/50">
                  <span className="text-sm font-semibold text-indigo-700">Lucro Líquido Distribuível</span>
                  <span className="text-xl font-black text-indigo-900">{formatCurrency(summary?.netProfit || 0)}</span>
                </div>
                
                <div className="pt-4">
                  <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-indigo-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Lucro Final (Líquido)</p>
                    <p className="text-4xl font-black text-emerald-600 leading-none">{formatCurrency(summary?.netProfit || 0)}</p>
                  </div>
                </div>

                <div className="p-4 bg-indigo-100/50 rounded-2xl">
                    <p className="text-[11px] text-indigo-800 font-medium leading-relaxed">
                        <i className="fa-solid fa-circle-info mr-2"></i>
                        Este é o valor final após o pagamento de todas as contas listadas e o desconto da taxa de administração ({lastMonth?.adminFeePercent}%) sobre o faturamento bruto.
                    </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-16 text-[10px] text-slate-300 font-bold uppercase tracking-[0.3em]">
          Gerado em {new Date().toLocaleDateString('pt-BR')} via FlatMoney
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
