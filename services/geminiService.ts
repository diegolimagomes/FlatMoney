
import { GoogleGenAI } from "@google/genai";
import { MonthData } from "../types";
import { calculateSummary, formatCurrency } from "../utils/calculations";

// Initialize the GoogleGenAI client using the required named parameter and environment variable.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFinancialInsight = async (data: MonthData) => {
  const summary = calculateSummary(data);
  const prompt = `
    Analise os seguintes dados financeiros de um flat de aluguel por temporada (Airbnb) para o mês de ${data.month}/${data.year}:
    - Faturamento Bruto (Airbnb): ${formatCurrency(summary.totalRevenue)}
    - Despesas Totais: ${formatCurrency(summary.totalExpenses)}
    - Taxa de Administração (${data.adminFeePercent}% sobre o Bruto): ${formatCurrency(summary.adminFeeAmount)}
    - Lucro Líquido Final (para distribuição): ${formatCurrency(summary.netProfit)}
    - Valor por Sócio (${data.partnersCount} sócios): ${formatCurrency(summary.perPartnerAmount)}

    Por favor, forneça um resumo amigável e direto em português (máximo 3 parágrafos) para o dono do flat. 
    Diga se o mês foi bom, dê um conselho simples para melhorar e explique a divisão dos sócios de forma que qualquer pessoa entenda, ressaltando que a administração recebeu sua parte baseada no faturamento total.
    Use um tom encorajador e profissional.
  `;

  try {
    // Generate content using the recommended model for basic text tasks.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    // Directly access the .text property from the GenerateContentResponse.
    return response.text;
  } catch (error) {
    console.error("Erro ao obter insight da IA:", error);
    return "Não foi possível gerar a análise da IA no momento.";
  }
};
