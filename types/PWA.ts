// Тип події beforeinstallprompt — відсутній у стандартних lib.dom.d.ts
export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
 