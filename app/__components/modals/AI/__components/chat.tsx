"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/app/lib/actions/gemini/chat";
import type { ChatMessage } from "@/app/types";
import { useTranslations } from "next-intl";

export function AiChatContent() {
  const t = useTranslations("ai.modal.chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

    const result = await sendChatMessage(messages, userMessage.text);

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
      <div className="flex-1 flex flex-col gap-4">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground m-auto">
            {t('description')}
          </p>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 whitespace-pre-wrap text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-muted text-foreground rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted text-muted-foreground rounded-2xl rounded-bl-none px-4 py-2 text-sm animate-pulse">
              Думаю...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          className="flex-1 px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
        >
          {t('submit')}
        </button>
      </form>
    </>
  );
}