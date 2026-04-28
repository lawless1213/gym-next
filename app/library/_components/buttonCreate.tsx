import { IconPlus } from "@tabler/icons-react";

export default function ButtonCreate({ onClick }: { onClick: (e: React.MouseEvent<HTMLButtonElement>) => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      aria-label="Create exercise">
      <IconPlus className="h-6 w-6" />
    </button>
  );
}
