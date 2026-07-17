import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GEMINI_MODEL = "gemini-3.1-flash-lite" as const;

export type GeminiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };
	
export async function generateStructured<T>(params: {
  prompt: string;
  schema: object;
  model?: string;
}): Promise<GeminiResult<T>> {
  const { prompt, schema, model = GEMINI_MODEL } = params;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      },
    });

    if (!response.text) {
      return { success: false, error: "Порожня відповідь від AI" };
    }

    const data = JSON.parse(response.text) as T;
    return { success: true, data };
  } catch (err: any) {
    console.error("Gemini generation error:", err);

    if (err?.status === 429) {
      return { success: false, error: "Сервіс тимчасово перевантажений. Спробуйте пізніше." };
    }
    if (err?.status === 404) {
      return { success: false, error: "Модель AI недоступна. Зверніться до підтримки." };
    }
    if (err?.status === 401 || err?.status === 403) {
      return { success: false, error: "Помилка авторизації сервісу AI." };
    }

    return { success: false, error: "Не вдалося обробити запит до AI" };
  }
}