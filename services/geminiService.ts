
import { GoogleGenAI } from "@google/genai";
import { MonthData } from "../types";
import { calculateSummary, formatCurrency } from "../utils/calculations";

// Prioritize process.env.API_KEY as per system instructions, fallback to VITE prefix for local convenience if specified in README.
const apiKey = process.env.API_KEY || (import.meta as any).env?.VITE_GOOGLE_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

export const getFinancialInsight = async (data: MonthData) => {
  const summary = calculateSummary(data);
  const prompt = `
    Analise os seguintes dados financeiros de um flat de aluguel por temporada (Airbnb) para o mês de ${data.month}/${data.year}:
    - Faturamento Bruto (Airbnb): ${formatCurrency(summary.totalRevenue)}
    - Despesas Totais: ${formatCurrency(summary.totalExpenses)}
    - Taxa de Administração (${data.adminFeePercent}% sobre o Bruto): ${formatCurrency(summary.adminFeeAmount)}
    - Lucro Líquido Final (para distribuição): ${formatCurrency(summary.netProfit)}

    Por favor, forneça um resumo amigável e direto em português (máximo 3 parágrafos) para o dono do flat. 
    Diga se o mês foi bom, dê um conselho simples para melhorar e ressalte o Lucro Final (Líquido) que sobrou no bolso.
    Foque na transparência dos gastos e na saúde financeira do flat.
    Use um tom encorajador e profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Erro ao obter insight da IA:", error);
    return "Não foi possível gerar a análise da IA no momento. Verifique sua chave de API.";
  }
};
