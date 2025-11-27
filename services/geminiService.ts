import { GoogleGenAI, Type } from "@google/genai";
import { SoilMetrics, SoilAnalysisResult } from "../types";
import { GEMINI_MODEL } from "../constants";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const analyzeSoilHealth = async (metrics: SoilMetrics): Promise<SoilAnalysisResult> => {
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  const prompt = `
    Analyze the following soil sensor data for agricultural purposes:
    - Nitrogen (N): ${metrics.nitrogen} ppm
    - Phosphorus (P): ${metrics.phosphorus} ppm
    - Potassium (K): ${metrics.potassium} ppm
    - pH Level: ${metrics.ph}
    - Moisture: ${metrics.moisture}%
    - Temperature: ${metrics.temperature}°C

    Provide a structured analysis including a health score (0-100), status, summary, specific recommendations, suitable crops for these conditions, and a fertilizer plan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            healthScore: { type: Type.INTEGER, description: "A score from 0 to 100 indicating soil health." },
            status: { type: Type.STRING, enum: ["Critical", "Poor", "Average", "Good", "Excellent"] },
            summary: { type: Type.STRING, description: "A brief summary of the soil condition." },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of actionable steps to improve soil."
            },
            suitableCrops: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of crops that would thrive in these conditions."
            },
            fertilizerPlan: { type: Type.STRING, description: "Specific fertilizer advice." }
          },
          required: ["healthScore", "status", "summary", "recommendations", "suitableCrops", "fertilizerPlan"],
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as SoilAnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
