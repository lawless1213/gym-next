"use client";

import clsx from "clsx";

export function AsideButton({ button }: { button: { label: string; onClick: React.MouseEventHandler<HTMLButtonElement>; icon?: React.ReactNode; shortLabel?: string; active?: boolean } }) {
  return (
    <button
      className={clsx(
        "group relative flex items-center justify-center w-12 h-12 rounded-md border hover:cursor-pointer",
        {
					'border-panel border-solid duration-200 hover:border-gray-500': !button.active,
					'bg-primary-1 border-0': button.active,
        }
      )}
      onClick={button.onClick}>
      {button.icon}
      <span className="uppercase">{button.shortLabel}</span>
      <span className="pointer-events-none absolute left-full ml-3 min-w-max -translate-y-1/2 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 shadow-lg ring-1 ring-black/10 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 top-1/2">{button.label}</span>
    </button>
  );
}
