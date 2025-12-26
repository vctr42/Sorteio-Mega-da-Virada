
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getNumberInsights = async (numbers: number[]): Promise<any> => {
  if (!API_KEY) return null;
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise estes números gerados aleatoriamente: ${numbers.join(", ")}. 
      Forneça uma análise divertida em Português sobre possíveis padrões, curiosidades matemáticas ou 'vibe' desses números.`,
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

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return null;
  }
};
