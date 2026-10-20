"use server";

import { generateChatText } from "@/lib/server/ai/client";
import { withAiTry } from "@/lib/server/ai/guard";
import { AIChatRequestSchema } from "@/lib/schemas/ai.schema";
import type { ChatMessage } from "@/types";

const SYSTEM_INSTRUCTION = `
Ти — досвідчений фітнес-тренер та нутриціолог.
Твоя мета — давати чіткі, практичні та безпечні поради щодо тренувань, харчування та спорту.
Відповідь має бути тою мовою, якою користувач ввів свій запит.
`;

/**
 * @param history previous messages, WITHOUT the new one (only the last AI_CHAT_HISTORY_MAX are used)
 * @param newMessageText the new user message
 */
export async function sendChatMessage(idToken: string, history: ChatMessage[], newMessageText: string) {
  const parsed = AIChatRequestSchema.safeParse({ history, message: newMessageText });
  if (!parsed.success) {
    return { success: false as const, error: "Повідомлення занадто довге або некоректне." };
  }
  const { history: recentHistory, message } = parsed.data;

  return withAiTry(idToken, () =>
    generateChatText({
      contents: [
        ...recentHistory.map((msg) => ({ role: msg.role, parts: [{ text: msg.text }] })),
        { role: "user" as const, parts: [{ text: message }] },
      ],
      systemInstruction: SYSTEM_INSTRUCTION,
    }),
  );
}

export type SendChatMessageResult = Awaited<ReturnType<typeof sendChatMessage>>;
