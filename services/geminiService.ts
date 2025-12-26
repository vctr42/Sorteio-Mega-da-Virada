
import { GoogleGenAI, Type } from "@google/genai";

export const getNumberInsights = async (numbers: number[]): Promise<any> => {
  // Acessa a chave apenas no momento da chamada para evitar crash top-level
  const apiKey = (process.env as any).API_KEY;
  
  if (!apiKey) {
    console.warn("API_KEY não configurada no ambiente.");
    return {
      analysis: "Seus números parecem promissores! (Configure a API_KEY para uma análise profunda via IA)",
      funFact: "Você sabia que as chances de ganhar na Mega são de 1 em 50 milhões?",
      patternObserved: "Vibe de sorte detectada."
    };
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise estes números da Mega da Virada: ${numbers.join(", ")}. 
      Forneça uma análise divertida em Português sobre possíveis padrões, curiosidades matemáticas ou a 'energia' desses números.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "Uma breve análise dos números." },
            funFact: { type: Type.STRING, description: "Uma curiosidade matemática relacionada ao intervalo ou aos números." },
            patternObserved: { type: Type.STRING, description: "Qualquer padrão ou coincidência observada." }
          },
          required: ["analysis", "funFact", "patternObserved"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};
