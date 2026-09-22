"use server";

import { generateChatText, type GeminiResult } from "./client";
import { requireFreeTry } from "./guard";
import type { ChatMessage } from "@/types";

const MAX_HISTORY_MESSAGES = 10;

const SYSTEM_INSTRUCTION = `
Ти — досвідчений фітнес-тренер та нутриціолог.
Твоя мета — давати чіткі, практичні та безпечні поради щодо тренувань, харчування та спорту.
Відповідь має бути тою мовою, якою користувач ввів свій запит.
`;

export type SendChatMessageResult = GeminiResult<string> & { freeAiTries: number };

export async function sendChatMessage(
  idToken: string,
  history: ChatMessage[],
  newMessageText: string
): Promise<SendChatMessageResult> {
  const guard = await requireFreeTry(idToken);
  if (!guard.ok) {
    return { success: false, error: guard.error, freeAiTries: guard.freeAiTries };
  }

  const recentHistory = history.slice(-MAX_HISTORY_MESSAGES);

  const contents = [
    ...recentHistory.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: "user" as const,
      parts: [{ text: newMessageText }],
    },
  ];

  const result = await generateChatText({
    contents,
    systemInstruction: SYSTEM_INSTRUCTION,
  });

  return { ...result, freeAiTries: guard.freeAiTries };
}