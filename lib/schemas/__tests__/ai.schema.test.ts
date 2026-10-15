import { describe, expect, it } from "vitest";
import { AI_CHAT_HISTORY_MAX, AI_COMMENT_MAX, AIChatRequestSchema, AIRoutineRequestSchema } from "../ai.schema";
import { AiExerciseResponseSchema, toGeminiJsonSchema } from "../ai-response.schema";

const routineInput = {
  groups: ["chest"],
  equipment: "gym",
  difficulty: "beginner",
  goal: "strength",
  locale: "uk",
};

describe("AIRoutineRequestSchema", () => {
  it("accepts a valid request", () => {
    expect(AIRoutineRequestSchema.safeParse(routineInput).success).toBe(true);
  });

  it("rejects unknown locale", () => {
    const parsed = AIRoutineRequestSchema.safeParse({ ...routineInput, locale: "xx" });
    expect(parsed.success).toBe(false);
  });

  it("rejects a comment over the limit", () => {
    const parsed = AIRoutineRequestSchema.safeParse({ ...routineInput, comment: "a".repeat(AI_COMMENT_MAX + 1) });
    expect(parsed.success).toBe(false);
  });
});

describe("AIChatRequestSchema", () => {
  const msg = (i: number) => ({ id: String(i), role: i % 2 ? "model" : "user", text: `m${i}` });

  it("keeps only the last N history messages", () => {
    const parsed = AIChatRequestSchema.parse({ history: Array.from({ length: 25 }, (_, i) => msg(i)), message: "hi" });
    expect(parsed.history).toHaveLength(AI_CHAT_HISTORY_MAX);
    expect(parsed.history.at(-1)?.id).toBe("24");
  });

  it("rejects forged roles and empty messages", () => {
    expect(
      AIChatRequestSchema.safeParse({ history: [{ id: "1", role: "system", text: "x" }], message: "hi" }).success,
    ).toBe(false);
    expect(AIChatRequestSchema.safeParse({ history: [], message: "   " }).success).toBe(false);
  });
});

describe("AiExerciseResponseSchema", () => {
  it("accepts a valid Gemini answer and rejects an unknown muscle group", () => {
    const ok = { exercise: { name: "Жим", description: "…", muscleGroup: "chest" }, summary: "" };
    expect(AiExerciseResponseSchema.safeParse(ok).success).toBe(true);
    expect(
      AiExerciseResponseSchema.safeParse({ ...ok, exercise: { ...ok.exercise, muscleGroup: "груди" } }).success,
    ).toBe(false);
  });

  it("generates a JSON schema without $schema", () => {
    const json = toGeminiJsonSchema(AiExerciseResponseSchema);
    expect(json.$schema).toBeUndefined();
    expect(json.type).toBe("object");
  });
});
