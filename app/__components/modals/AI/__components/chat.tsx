"use client";

import { useState, useRef, useCallback } from "react";
import { sendChatMessage } from "@/app/lib/actions/gemini/chat";
import type { ChatMessage } from "@/app/types";
import { useTranslations } from "next-intl";
import { Input } from "@/app/__components/form/input";
import { IconSend } from "@tabler/icons-react";
import { Button } from "@/app/__components/buttons/button";
import { TypewriterText } from "@/app/__components/common/TypewritterText";

export function AiChatContent() {
  const t = useTranslations("ai.modal.chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Огортаємо в useCallback, щоб посилання на функцію не змінювалося
  const scrollToBottom = useCallback((smooth = false) => {
    messagesEndRef.current?.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  // ❌ useEffect звідси прибрано — згладжуванням і скролом повністю керує TypewriterText

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    // Скролимо донизу одразу після відправки повідомлення користувача
    scrollToBottom(true);

    // Передаємо оновлену історію
    const result = await sendChatMessage(updatedHistory, userMessage.text);

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

  return (
    <>
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground m-auto">{t("description")}</p>
        )}

        {messages.map((msg, index) => {
          const isLastMessage = index === messages.length - 1;
          const isModel = msg.role === "model";

          return (
            <div
              key={msg.id}
              className={`flex ${isModel ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap text-sm ${
                  isModel
                    ? "bg-muted text-foreground rounded-bl-none"
                    : "bg-primary text-primary-foreground rounded-br-none"
                }`}>
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
            <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none px-4 py-2 text-sm animate-pulse">
              {t("loading")}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 mt-auto">
        <Input
          input={{
            id: "chatInput",
            placeholder: t("placeholder"),
            type: "text",
            value: input,
            onChange: (e) => setInput(e.target.value),
            disabled: isLoading,
            withoutError: true,
          }}
        />
        <Button
          size="icon-xl"
          type="submit"
          disabled={isLoading || !input.trim()}>
          <IconSend className="size-6" />
        </Button>
      </form>
    </>
  );
}