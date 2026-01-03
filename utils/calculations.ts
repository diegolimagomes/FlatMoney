
import { MonthData, FinancialSummary } from '../types';

export const calculateSummary = (data: MonthData): FinancialSummary => {
  const totalExpenses = data.expenses.reduce((sum, item) => sum + item.amount, 0);
  
  // A taxa de administração é calculada sobre o Faturamento Bruto (Airbnb)
  const adminFeeAmount = (data.revenue * data.adminFeePercent) / 100;
  
  // O lucro líquido (final) é o faturamento menos despesas e menos a taxa de administração
  const netProfit = data.revenue - totalExpenses - adminFeeAmount;
  
  const perPartnerAmount = data.partnersCount > 0 ? netProfit / data.partnersCount : 0;

  // Arredondamos para 2 casas decimais
  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  return {
    totalRevenue: round(data.revenue),
    totalExpenses: round(totalExpenses),
    netProfit: round(netProfit),
    adminFeeAmount: round(adminFeeAmount),
    perPartnerAmount: round(Math.max(0, perPartnerAmount)),
  };
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const monthsList = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const exportToCSV = (data: MonthData[]) => {
  if (data.length === 0) return;

  const headers = ["Mês", "Ano", "Faturamento", "Despesas Totais", "Taxa Adm (%)", "Taxa Adm (R$)", "Lucro Líquido", "Sócios", "Valor/Sócio"];
  
  const rows = data.map(item => {
    const s = calculateSummary(item);
    return [
      item.month,
      item.year,
      s.totalRevenue.toString().replace('.', ','),
      s.totalExpenses.toString().replace('.', ','),
      item.adminFeePercent,
      s.adminFeeAmount.toString().replace('.', ','),
      s.netProfit.toString().replace('.', ','),
      item.partnersCount,
      s.perPartnerAmount.toString().replace('.', ',')
    ];
  });

  const csvContent = [
    headers.join(";"),
    ...rows.map(e => e.join(";"))
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `flat-money-relatorio-${new Date().getFullYear()}.csv`);
  link.click();
};
