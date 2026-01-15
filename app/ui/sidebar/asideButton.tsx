'use client';

export function AsideButton({ button }: { button: { label: string; onClick: React.MouseEventHandler<HTMLButtonElement>; icon?: React.ReactNode; shortLabel?: string} }) {
  return (
    <button
      className="group relative flex items-center justify-center w-12 h-12 rounded-md border border-panel border-solid hover:border-gray-500 duration-200 cursor-pointer"
      onClick={button.onClick}>
      {button.icon}
      {button.shortLabel}
      <span className="pointer-events-none absolute left-full ml-3 min-w-max -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg ring-1 ring-black/10 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 top-1/2">
        {button.label}
      </span>
    </button>
  );
}
