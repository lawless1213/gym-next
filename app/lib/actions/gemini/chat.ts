"use server";

import { generateChatText, type GeminiResult } from "./client";
import type { ChatMessage } from "@/app/types";

const MAX_HISTORY_MESSAGES = 10;

const SYSTEM_INSTRUCTION = `
Ти — досвідчений фітнес-тренер та нутриціолог.
Твоя мета — давати чіткі, практичні та безпечні поради щодо тренувань, харчування та спорту.
Відповідь має бути тою мовою, якою користувач ввів свій запит.
`;

export async function sendChatMessage(
  history: ChatMessage[],
  newMessageText: string
): Promise<GeminiResult<string>> {
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

  return generateChatText({
    contents,
    systemInstruction: SYSTEM_INSTRUCTION,
  });
}