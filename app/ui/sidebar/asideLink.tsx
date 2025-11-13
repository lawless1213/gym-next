'use client'

import clsx from 'clsx';
import Link from "next/link";


export function AsideLink({ link }: { link: { label: string; link: string; active: boolean; icon: React.ReactNode } }) {
  return (
    <Link
      className={clsx(
        "group relative flex items-center justify-center w-12 h-12 rounded-md border  ",
        {
					'border-panel border-solid duration-200 hover:border-gray-500': !link.active,
					'bg-primary-1 border-0': link.active,
        }
      )}
      key={link.label}
      href={link.link}>
      {link.icon}
      <span className="pointer-events-none absolute left-full ml-3 min-w-max -translate-y-1/2 whitespace-nowrap  rounded-md bg-panel px-2 py-1 text-sm text-white opacity-0 shadow-lg ring-1 ring-black/10 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 top-1/2">
        {link.label}
      </span>
    </Link>
  );
}
