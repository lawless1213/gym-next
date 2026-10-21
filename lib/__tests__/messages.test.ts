import { describe, expect, it } from "vitest";
import en from "@/messages/en.json";
import uk from "@/messages/uk.json";
import { AI_ERROR_CODES } from "@/lib/errors/ai";

type Messages = { [key: string]: string | Messages };

function flatKeys(messages: Messages, prefix = ""): string[] {
  return Object.entries(messages).flatMap(([key, value]) =>
    typeof value === "string" ? [`${prefix}${key}`] : flatKeys(value, `${prefix}${key}.`),
  );
}

describe("messages", () => {
  it("uk and en have the same keys", () => {
    const enKeys = new Set(flatKeys(en as Messages));
    const ukKeys = new Set(flatKeys(uk as Messages));
    expect([...ukKeys].filter((key) => !enKeys.has(key))).toEqual([]);
    expect([...enKeys].filter((key) => !ukKeys.has(key))).toEqual([]);
  });

  it("every AI error code has a translation", () => {
    for (const messages of [en, uk] as Messages[]) {
      const keys = new Set(flatKeys(messages));
      expect(AI_ERROR_CODES.filter((code) => !keys.has(`ai.errors.${code}`))).toEqual([]);
    }
  });
});
