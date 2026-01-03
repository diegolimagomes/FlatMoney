
import { GoogleGenAI } from "@google/genai";
import { MonthData } from "../types";
import { calculateSummary, formatCurrency } from "../utils/calculations";

/**
 * The API key is obtained exclusively from process.env.API_KEY.
 */
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialInsight = async (data: MonthData) => {
  if (!process.env.API_KEY) {
    return "A chave de API (API_KEY) não foi configurada no ambiente.";
  }

  const summary = calculateSummary(data);
  const prompt = `
    Analise os seguintes dados financeiros de um flat de aluguel por temporada (Airbnb) para o mês de ${data.month}/${data.year}:
    - Faturamento Bruto (Airbnb): ${formatCurrency(summary.totalRevenue)}
    - Despesas Totais: ${formatCurrency(summary.totalExpenses)}
    - Taxa de Administração (${data.adminFeePercent}% sobre o Bruto): ${formatCurrency(summary.adminFeeAmount)}
    - Lucro Líquido Final (para distribuição): ${formatCurrency(summary.netProfit)}

    Por favor, forneça um resumo amigável e direto em português (máximo 3 parágrafos) para o dono do flat. 
    Diga se o mês foi bom comparando o lucro com o faturamento, dê um conselho simples para melhorar e ressalte o Lucro Líquido que sobrou no bolso.
    Foque na saúde financeira do flat e mantenha um tom profissional.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar uma resposta clara.";
  } catch (error) {
    console.error("Erro ao obter insight da IA:", error);
    return "Ocorreu um erro ao consultar a IA. Verifique os logs do console ou a validade da sua API_KEY.";
  }
};
