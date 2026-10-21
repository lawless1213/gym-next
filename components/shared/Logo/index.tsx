import { cn } from "@/lib/utils";

type LogoMarkProps = {
  className?: string;
  title?: string;
};

/** NextForma mark: the N's right stem doubles as the F. Same artwork as public/favicon.svg and app/logo.svg. */
export function LogoMark({ className, title }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      className={cn("size-16", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}>
      <rect
        width="100"
        height="100"
        rx="22"
        className="fill-volt"
      />
      <g
        transform="translate(-1 -1)"
        className="stroke-volt-foreground"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M28 72V30L52 66V30H74" />
        <path d="M52 50H68" />
      </g>
    </svg>
  );
}

/** "NextForma" set in the display face; "Forma" takes the brand colour. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display font-bold tracking-tight", className)}>
      Next<span className="text-primary">Forma</span>
    </span>
  );
}
