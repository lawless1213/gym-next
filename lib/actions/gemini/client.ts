import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { toGeminiJsonSchema } from "@/lib/schemas/ai-response.schema";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GEMINI_MODEL = "gemini-3.1-flash-lite" as const;

const INVALID_RESPONSE_ERROR = "AI повернув некоректну відповідь. Спробуйте ще раз.";

export type GeminiResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export type ChatMessagePart = {
  role: "user" | "model";
  parts: { text: string }[];
};

/**
 * Structured generation: the Gemini JSON Schema is generated from the zod schema,
 * and the response is validated with `safeParse` (never trust `JSON.parse(...) as T`).
 */
export async function generateStructured<S extends z.ZodType>(params: {
  prompt: string;
  schema: S;
  model?: string;
}): Promise<GeminiResult<z.infer<S>>> {
  const { prompt, schema, model = GEMINI_MODEL } = params;

  let text: string | undefined;
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: toGeminiJsonSchema(schema),
      },
    });
    text = response.text;
  } catch (err) {
    return handleError(err);
  }

  if (!text) {
    return { success: false, error: "Порожня відповідь від AI" };
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    console.error("Gemini returned invalid JSON:", text.slice(0, 500));
    return { success: false, error: INVALID_RESPONSE_ERROR };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    console.error("Gemini response does not match schema:", z.prettifyError(parsed.error));
    return { success: false, error: INVALID_RESPONSE_ERROR };
  }

  return { success: true, data: parsed.data };
}

export async function generateChatText(params: {
  contents: ChatMessagePart[];
  systemInstruction?: string;
  model?: string;
}): Promise<GeminiResult<string>> {
  const { contents, systemInstruction, model = GEMINI_MODEL } = params;

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        ...(systemInstruction ? { systemInstruction } : {}),
      },
    });

    if (!response.text) {
      return { success: false, error: "Порожня відповідь від AI" };
    }

    return { success: true, data: response.text };
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown): { success: false; error: string } {
  console.error("Gemini generation error:", err);
  const status = typeof err === "object" && err !== null && "status" in err ? (err as { status?: number }).status : undefined;

  if (status === 429) {
    return { success: false, error: "Сервіс тимчасово перевантажений. Спробуйте пізніше." };
  }
  if (status === 404) {
    return { success: false, error: "Модель AI недоступна. Зверніться до підтримки." };
  }
  if (status === 401 || status === 403) {
    return { success: false, error: "Помилка авторизації сервісу AI." };
  }

  return { success: false, error: "Не вдалося обробити запит до AI" };
}