"use client";

import { useState, useRef, useCallback } from "react";
import { sendChatMessage } from "@/lib/server/actions/ai/chat";
import type { ChatMessage } from "@/types";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/form/Input";
import { IconSend } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { TypewriterText } from "@/components/ui/TypewriterText";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { UserParams } from "@/lib/services/user";
import { defaultUserParams, useUserPreferences } from "@/providers/UserPreferencesProvider";

export function AiChatContent() {
  const t = useTranslations("ai.modal.chat");
  const { params } = useUserPreferences();
  const queryClient = useQueryClient();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = useCallback((smooth = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: input.trim(),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);

    scrollToBottom(true);

    const idToken = await user.getIdToken();
    // `messages` = history before this message; the server appends the new one itself.
    const result = await sendChatMessage(idToken, messages, userMessage.text);

    if ("freeAiTries" in result) {
      queryClient.setQueryData(["userParams", user.uid], (old: UserParams | undefined) => ({
        ...defaultUserParams,
        ...old,
        subscribed: {
          ...(old?.subscribed ?? defaultUserParams.subscribed),
          freeAiTries: result.freeAiTries,
        },
      }));
    }

    setIsLoading(false);

    if (result.success) {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "model",
        text: result.data,
      };
      setMessages([...updatedHistory, aiMessage]);
    } else {
      alert(result.error);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
        {messages.length === 0 && <p className="m-auto text-center text-muted-foreground">{t("description")}</p>}

        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          const isModel = msg.role === "model";

          return (
            <div
              key={msg.id}
              className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap ${isModel ? "rounded-bl-none bg-muted text-foreground" : "rounded-br-none bg-primary text-primary-foreground"}`}>
                {isModel && isLastMessage ? (
                  <TypewriterText
                    text={msg.text}
                    onRender={scrollToBottom}
                  />
                ) : (
                  msg.text
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-start">
            <div className="animate-pulse rounded-2xl rounded-bl-none bg-muted px-4 py-2 text-sm text-muted-foreground">
              {t("loading")}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {!params.subscribed.isActive && params.subscribed.freeAiTries === 0 && (
        <div className="rounded-2xl bg-secondary p-2 text-center">дальші треба купіть подпіську</div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mt-auto flex gap-2">
        <Input
          input={{
            id: "chatInput",
            placeholder: t("placeholder"),
            type: "text",
            value: input,
            onChange: (e) => setInput(e.target.value),
            disabled: isLoading,
            withoutError: true,
            autoComplete: "off",
          }}
        />
        <Button
          size="icon-xl"
          type="submit"
          disabled={isLoading || !input.trim() || (!params.subscribed.isActive && params.subscribed.freeAiTries === 0)}>
          <IconSend className="size-6" />
        </Button>
      </form>
    </>
  );
}
