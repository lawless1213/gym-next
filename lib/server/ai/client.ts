import "server-only";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { toGeminiJsonSchema } from "@/lib/schemas/ai-response.schema";
import { reportError, reportIssue } from "@/lib/monitoring";
import type { AiFailure } from "@/lib/errors/ai";

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GEMINI_MODEL = "gemini-3.1-flash-lite" as const;

export type GeminiResult<T> = { success: true; data: T } | AiFailure;

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
    return { success: false, error: "AI_EMPTY_RESPONSE" };
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    reportIssue("Gemini returned invalid JSON", { model, sample: text.slice(0, 300) });
    return { success: false, error: "AI_INVALID_RESPONSE" };
  }

  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    reportIssue("Gemini response does not match schema", {
      model,
      issues: z.prettifyError(parsed.error).slice(0, 1000),
    });
    return { success: false, error: "AI_INVALID_RESPONSE" };
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
      return { success: false, error: "AI_EMPTY_RESPONSE" };
    }

    return { success: true, data: response.text };
  } catch (err) {
    return handleError(err);
  }
}

function handleError(err: unknown): AiFailure {
  const status =
    typeof err === "object" && err !== null && "status" in err ? (err as { status?: number }).status : undefined;
  // 429 is expected under load; everything else is worth an alert.
  if (status !== 429) reportError(err, "Gemini generation error", { status: status ?? null });

  if (status === 429) {
    return { success: false, error: "AI_OVERLOADED" };
  }
  if (status === 404 || status === 401 || status === 403) {
    // Model not found or our API key rejected: nothing the user can fix.
    return { success: false, error: "AI_UNAVAILABLE" };
  }

  return { success: false, error: "AI_FAILED" };
}
